
import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SALARIO_MINIMO = 1518;

const Reports = ({ clientes, contas, onBack }) => {

  // Helper to calculate age
  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  // Data processing for charts
  const { saldoData, limiteCreditoData, creditoDisponivelData, rendaAnualData, idadeData } = useMemo(() => {
    const saldoCategories = { 'Baixo': 0, 'Médio': 0, 'Alto': 0 };
    const limiteCreditoCategories = { 'Baixo': 0, 'Médio': 0, 'Alto': 0 };
    const creditoDisponivelCategories = { 'Baixo': 0, 'Médio': 0, 'Alto': 0 };
    const rendaAnualCategories = { '1-4 SM': 0, '5-10 SM': 0, '11-20 SM': 0, '20+ SM': 0 };
    const idadeCategories = { '18-25': 0, '26-40': 0, '41-60': 0, '60+': 0 };

    clientes.forEach(cliente => {
      const clienteContas = contas.filter(conta => conta.cpfCnpjCliente === cliente.cpfCnpj);
      const totalSaldo = clienteContas.reduce((sum, conta) => sum + conta.saldo, 0);
      const totalLimiteCredito = clienteContas.reduce((sum, conta) => sum + conta.limiteCredito, 0);
      const totalCreditoDisponivel = clienteContas.reduce((sum, conta) => sum + conta.creditoDisponivel, 0);
      const age = calculateAge(cliente.dataNascimento);
      const rendaAnualSM = cliente.rendaAnual / SALARIO_MINIMO;

      // Saldo
      if (totalSaldo < 5000) saldoCategories['Baixo']++;
      else if (totalSaldo < 20000) saldoCategories['Médio']++;
      else saldoCategories['Alto']++;

      // Limite de Crédito
      if (totalLimiteCredito < 5000) limiteCreditoCategories['Baixo']++;
      else if (totalLimiteCredito < 15000) limiteCreditoCategories['Médio']++;
      else limiteCreditoCategories['Alto']++;

      // Crédito Disponível
      if (totalCreditoDisponivel < 3000) creditoDisponivelCategories['Baixo']++;
      else if (totalCreditoDisponivel < 10000) creditoDisponivelCategories['Médio']++;
      else creditoDisponivelCategories['Alto']++;

      // Renda Anual por Salário Mínimo
      if (rendaAnualSM >= 1 && rendaAnualSM <= 4) rendaAnualCategories['1-4 SM']++;
      else if (rendaAnualSM > 4 && rendaAnualSM <= 10) rendaAnualCategories['5-10 SM']++;
      else if (rendaAnualSM > 10 && rendaAnualSM <= 20) rendaAnualCategories['11-20 SM']++;
      else if (rendaAnualSM > 20) rendaAnualCategories['20+ SM']++;

      // Idade
      if (age >= 18 && age <= 25) idadeCategories['18-25']++;
      else if (age >= 26 && age <= 40) idadeCategories['26-40']++;
      else if (age >= 41 && age <= 60) idadeCategories['41-60']++;
      else if (age > 60) idadeCategories['60+']++;
    });

    const generateChartData = (categories, title, suffix = '') => ({
      labels: Object.keys(categories).map(label => `${label}${suffix}`),
      datasets: [
        {
          label: title,
          data: Object.values(categories),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

    return {
      saldoData: generateChartData(saldoCategories, 'Distribuição de Saldo'),
      limiteCreditoData: generateChartData(limiteCreditoCategories, 'Distribuição de Limite de Crédito'),
      creditoDisponivelData: generateChartData(creditoDisponivelCategories, 'Distribuição de Crédito Disponível'),
      rendaAnualData: generateChartData(rendaAnualCategories, `Distribuição de Renda Anual (Salário Mínimo: R$${SALARIO_MINIMO})`),
      idadeData: generateChartData(idadeCategories, 'Distribuição de Idade dos Clientes'),
    };
  }, [clientes, contas]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Pie Chart'
      },
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = (value * 100 / sum).toFixed(2) + '%';
          return percentage;
        },
        color: '#fff',
      },
    },
  };

  const exportToExcel = () => {
    const ws_data = [
      ['Relatório de Clientes'],
      [],
    ];

    const addChartDataToSheet = (title, labels, data) => {
      ws_data.push([title]);
      ws_data.push(['Categoria', 'Quantidade']);
      for (let i = 0; i < labels.length; i++) {
        ws_data.push([labels[i], data[i]]);
      }
      ws_data.push([]); // Add an empty row for spacing
    };

    addChartDataToSheet('Distribuição de Saldo', saldoData.labels, saldoData.datasets[0].data);
    addChartDataToSheet('Distribuição de Limite de Crédito', limiteCreditoData.labels, limiteCreditoData.datasets[0].data);
    addChartDataToSheet('Distribuição de Crédito Disponível', creditoDisponivelData.labels, creditoDisponivelData.datasets[0].data);
    addChartDataToSheet(`Distribuição de Renda Anual (Salário Mínimo: R$${SALARIO_MINIMO})`, rendaAnualData.labels, rendaAnualData.datasets[0].data);
    addChartDataToSheet('Distribuição de Idade dos Clientes', idadeData.labels, idadeData.datasets[0].data);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Relatórios');
    XLSX.writeFile(wb, 'relatorios_clientes.xlsx');
  };

  return (
    <div className="reports-container">
      <button onClick={onBack} className="back-button">Voltar para a Lista de Clientes</button>
      <h2>Relatórios de Clientes</h2>

      <div className="report-actions">
        <button onClick={exportToExcel} className="export-excel-button">Exportar para Excel</button>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Distribuição de Saldo</h3>
          <Pie data={saldoData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Distribuição de Saldo' } } }} />
        </div>
        <div className="chart-card">
          <h3>Distribuição de Limite de Crédito</h3>
          <Pie data={limiteCreditoData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Distribuição de Limite de Crédito' } } }} />
        </div>
        <div className="chart-card">
          <h3>Distribuição de Crédito Disponível</h3>
          <Pie data={creditoDisponivelData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Distribuição de Crédito Disponível' } } }} />
        </div>
        <div className="chart-card">
          <h3>Distribuição de Renda Anual</h3>
          <Pie data={rendaAnualData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: `Distribuição de Renda Anual (Salário Mínimo: R$${SALARIO_MINIMO})` } } }} />
        </div>
        <div className="chart-card">
          <h3>Distribuição de Idade dos Clientes</h3>
          <Pie data={idadeData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Distribuição de Idade dos Clientes' } } }} />
        </div>
      </div>
    </div>
  );
};

export default Reports;




