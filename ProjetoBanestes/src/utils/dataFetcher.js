// Função para parsear CSV de forma mais robusta, considerando vírgulas dentro de aspas
const parsearCsv = (textoCsv, cabecalhosSobrescritos) => {
    const linhas = textoCsv.trim().split("\n");
    if (linhas.length === 0) return [];

    const cabecalhos = cabecalhosSobrescritos || linhas[0].split(",").map(cabecalho => cabecalho.trim());
    const dados = linhas.slice(1).map(linha => {
        // Regex mais sofisticada para dividir a linha, considerando aspas duplas
        // e permitindo vírgulas dentro de campos entre aspas.
        const valores = linha.match(/(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g)
            ?.map(val => val.endsWith(",") ? val.slice(0, -1) : val)
            .map(val => val.startsWith("\"") && val.endsWith("\"") ? val.slice(1, -1).replace(/""/g, "\"") : val)
            .filter(val => val !== undefined && val !== null) || [];

        // Assegura que o array de valores tenha o mesmo comprimento dos cabeçalhos
        while (valores.length < cabecalhos.length) {
            valores.push("");
        }

        const objeto = {};
        cabecalhos.forEach((cabecalho, indice) => {
            objeto[cabecalho] = valores[indice];
        });
        return objeto;
    });
    return dados;
};

const buscarDados = async (caminhoArquivo, cabecalhosSobrescritos) => {
    try {
        const response = await fetch(caminhoArquivo);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const textoCsv = await response.text();
        return parsearCsv(textoCsv, cabecalhosSobrescritos);
    } catch (erro) {
        console.error("Erro ao buscar ou parsear dados de", caminhoArquivo, ":", erro);
        return [];
    }
};

export const buscarClientes = async () => {
    const caminhoArquivo = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes";
    // Definindo os cabeçalhos esperados para clientes.csv
    const cabecalhosCliente = ["id", "cpfCnpj", "rg", "dataNascimento", "nome", "nomeSocial", "email", "endereco", "rendaAnual", "patrimonio", "estadoCivil", "codigoAgencia"];
    const clientes = await buscarDados(caminhoArquivo, cabecalhosCliente);
    const agencias = await buscarAgencias();

    return clientes.map(cliente => {
        const rendaAnualStr = (cliente.rendaAnual || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();
        const patrimonioStr = (cliente.patrimonio || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();

        const clienteParseado = {
            ...cliente,
            dataNascimento: new Date(cliente.dataNascimento),
            rendaAnual: parseFloat(rendaAnualStr) || 0,
            patrimonio: parseFloat(patrimonioStr) || 0,
            codigoAgencia: parseInt(cliente.codigoAgencia, 10) || 0,
        };

        const agenciaVinculada = agencias.find(agencia => agencia.codigo === clienteParseado.codigoAgencia);
        if (agenciaVinculada) {
            clienteParseado.agencia = {
                nome: agenciaVinculada.nome,
                endereco: agenciaVinculada.endereco,
                codigo: agenciaVinculada.codigo
            };
        } else {
            clienteParseado.agencia = undefined;
        }

        return clienteParseado;
    });
};

export const buscarContas = async () => {
    const caminhoArquivo = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas";
    // Definindo os cabeçalhos esperados para contas.csv
    const cabecalhosConta = ["id", "cpfCnpjCliente", "tipo", "saldo", "limiteCredito", "creditoDisponivel", "codigoAgencia"];
    const contas = await buscarDados(caminhoArquivo, cabecalhosConta);
    const agencias = await buscarAgencias();

    return contas.map(conta => {
        const saldoStr = (conta.saldo || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();
        const limiteCreditoStr = (conta.limiteCredito || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();
        const creditoDisponivelStr = (conta.creditoDisponivel || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();

        const contaParseada = {
            ...conta,
            saldo: parseFloat(saldoStr) || 0,
            limiteCredito: parseFloat(limiteCreditoStr) || 0,
            creditoDisponivel: parseFloat(creditoDisponivelStr) || 0,
            codigoAgencia: parseInt(conta.codigoAgencia, 10) || 0,
        };

        const agenciaVinculada = agencias.find(agencia => agencia.codigo === contaParseada.codigoAgencia);
        if (agenciaVinculada) {
            contaParseada.nomeAgencia = agenciaVinculada.nome;
            contaParseada.enderecoAgencia = agenciaVinculada.endereco;
        } else {
            contaParseada.nomeAgencia = undefined;
            contaParseada.enderecoAgencia = undefined;
        }
        return contaParseada;
    });
};

export const buscarAgencias = async () => {
    const caminhoArquivo = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias";
    // Definindo os cabeçalhos esperados para agencias.csv
    const cabecalhosAgencia = ["id", "codigo", "nome", "endereco"];
    const agencias = await buscarDados(caminhoArquivo, cabecalhosAgencia);
    return agencias.map(agencia => ({
        ...agencia,
        codigo: parseInt(agencia.codigo, 10) || 0,
    }));
};


