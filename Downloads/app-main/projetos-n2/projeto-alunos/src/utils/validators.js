// Utilitários de máscara e validação de campos

// ===== MÁSCARAS (formatam enquanto digita) =====

export const mascaraCPF = (texto) => {
  const numeros = texto.replace(/\D/g, '').slice(0, 11);
  return numeros
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
};

export const mascaraRG = (texto) => {
  // RG: até 9 dígitos -> 00.000.000-0
  const numeros = texto.replace(/[^\dxX]/g, '').slice(0, 9);
  return numeros
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})([\dxX])/, '$1.$2.$3-$4');
};

export const mascaraData = (texto) => {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  return numeros
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
};

export const mascaraTelefone = (texto) => {
  const numeros = texto.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/^(\(\d{2}\) \d{4})(\d)/, '$1-$2');
  }
  return numeros
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/^(\(\d{2}\) \d{5})(\d)/, '$1-$2');
};

// ===== VALIDAÇÕES (retornam true/false) =====

export const validarCPF = (cpf) => {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false; // todos iguais

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(numeros[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(numeros[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros[10])) return false;

  return true;
};

export const validarRG = (rg) => {
  const numeros = rg.replace(/[^\dxX]/g, '');
  return numeros.length >= 7 && numeros.length <= 9;
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const validarData = (data) => {
  const numeros = data.replace(/\D/g, '');
  if (numeros.length !== 8) return false;
  const dia = parseInt(numeros.slice(0, 2));
  const mes = parseInt(numeros.slice(2, 4));
  const ano = parseInt(numeros.slice(4, 8));
  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  const anoAtual = new Date().getFullYear();
  if (ano < 1900 || ano > anoAtual) return false;
  // valida dia conforme o mês
  const diasNoMes = new Date(ano, mes, 0).getDate();
  if (dia > diasNoMes) return false;
  return true;
};

export const validarTelefone = (telefone) => {
  const numeros = telefone.replace(/\D/g, '');
  return numeros.length === 10 || numeros.length === 11;
};
