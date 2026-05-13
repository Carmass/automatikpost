// Utility helpers

export function cls(...args) {
  return args.filter(Boolean).join(' ');
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatNumber(n) {
  return Number(n).toLocaleString('pt-BR');
}
