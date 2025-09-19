// Função para parsear CSV de forma mais robusta, considerando vírgulas dentro de aspas
const parseCsv = (csvString, headersOverride) => {
    const lines = csvString.trim().split("\n");
    if (lines.length === 0) return [];

    const headers = headersOverride || lines[0].split(",").map(header => header.trim());
    const data = lines.slice(1).map(line => {
        // Regex mais sofisticada para dividir a linha, considerando aspas duplas
        // e permitindo vírgulas dentro de campos entre aspas.
        const values = line.match(/(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g)
            ?.map(val => val.endsWith(",") ? val.slice(0, -1) : val)
            .map(val => val.startsWith("\"") && val.endsWith("\"") ? val.slice(1, -1).replace(/""/g, "\"") : val)
            .filter(val => val !== undefined && val !== null) || [];

        // Assegura que o array de valores tenha o mesmo comprimento dos cabeçalhos
        while (values.length < headers.length) {
            values.push("");
        }

        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    });
    return data;
};

const fetchData = async (filePath, headersOverride) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        return parseCsv(csvText, headersOverride);
    } catch (error) {
        console.error("Error fetching or parsing data from", filePath, ":", error);
        return [];
    }
};

export const fetchClientes = async () => {
    const filePath = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes";
    // Definindo os cabeçalhos esperados para clientes.csv
    const clienteHeaders = ["id", "cpfCnpj", "rg", "dataNascimento", "nome", "nomeSocial", "email", "endereco", "rendaAnual", "patrimonio", "estadoCivil", "codigoAgencia"];
    const clientes = await fetchData(filePath, clienteHeaders);
    const agencias = await fetchAgencias();

    return clientes.map(cliente => {
        const rendaAnualStr = (cliente.rendaAnual || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();
        const patrimonioStr = (cliente.patrimonio || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();

        const parsedCliente = {
            ...cliente,
            dataNascimento: new Date(cliente.dataNascimento),
            rendaAnual: parseFloat(rendaAnualStr) || 0,
            patrimonio: parseFloat(patrimonioStr) || 0,
            codigoAgencia: parseInt(cliente.codigoAgencia, 10) || 0,
        };

        const agenciaVinculada = agencias.find(agencia => agencia.codigo === parsedCliente.codigoAgencia);
        if (agenciaVinculada) {
            parsedCliente.nomeAgencia = agenciaVinculada.nome;
            parsedCliente.enderecoAgencia = agenciaVinculada.endereco;
        } else {
            parsedCliente.nomeAgencia = undefined;
            parsedCliente.enderecoAgencia = undefined;
        }

        return parsedCliente;
    });
};

export const fetchContas = async () => {
    const filePath = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas";
    // Definindo os cabeçalhos esperados para contas.csv
    const contaHeaders = ["id", "cpfCnpjCliente", "tipo", "saldo", "limiteCredito", "creditoDisponivel", "codigoAgencia"];
    const contas = await fetchData(filePath, contaHeaders);
    const agencias = await fetchAgencias();

    return contas.map(conta => {
        const saldoStr = (conta.saldo || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();
        const limiteCreditoStr = (conta.limiteCredito || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();
        const creditoDisponivelStr = (conta.creditoDisponivel || "0").replace(/R\$\s?|\./g, "").replace(",", ".").trim();

        const parsedConta = {
            ...conta,
            saldo: parseFloat(saldoStr) || 0,
            limiteCredito: parseFloat(limiteCreditoStr) || 0,
            creditoDisponivel: parseFloat(creditoDisponivelStr) || 0,
            codigoAgencia: parseInt(conta.codigoAgencia, 10) || 0,
        };

        const agenciaVinculada = agencias.find(agencia => agencia.codigo === parsedConta.codigoAgencia);
        if (agenciaVinculada) {
            parsedConta.nomeAgencia = agenciaVinculada.nome;
            parsedConta.enderecoAgencia = agenciaVinculada.endereco;
        } else {
            parsedConta.nomeAgencia = undefined;
            parsedConta.enderecoAgencia = undefined;
        }
        return parsedConta;
    });
};

export const fetchAgencias = async () => {
    const filePath = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias";
    // Definindo os cabeçalhos esperados para agencias.csv
    const agenciaHeaders = ["id", "codigo", "nome", "endereco"];
    const agencias = await fetchData(filePath, agenciaHeaders);
    return agencias.map(agencia => ({
        ...agencia,
        codigo: parseInt(agencia.codigo, 10) || 0,
    }));
};


