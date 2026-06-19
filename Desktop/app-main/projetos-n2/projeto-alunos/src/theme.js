// Tema central — Instituto Politécnico Horizonte (IPH)
// Estilo escuro / futurista / tecnológico, destaque em roxo/violeta

export const colors = {
  // fundos escuros
  bg: '#0A0A12',            // fundo principal (quase preto)
  bgElevated: '#13131F',    // superfícies elevadas
  surface: '#1A1A2B',       // cartões
  surfaceLight: '#24243A',  // inputs / cartões internos

  // verde-néon / lima (destaque)
  primary: '#65D80A',       // verde-lima principal
  primaryBright: '#A3FF12', // lima vibrante
  primaryGlow: '#84E80C',   // brilho
  accent: '#B6FF3D',        // lima claro (detalhes)
  onPrimary: '#0A0A12',     // texto sobre botões verdes (escuro p/ contraste)

  // texto
  text: '#F5F3FF',          // texto principal (quase branco)
  textMuted: '#9CA3AF',     // texto secundário
  textDim: '#6B7280',       // texto apagado

  // bordas
  border: '#2D2D44',
  borderGlow: '#65D80A',

  // status
  danger: '#F43F5E',
  success: '#2DD4BF',  // teal (status entregue, distinto do lima da marca)
  warning: '#FBBF24',
  white: '#FFFFFF',
};

export const instituicao = {
  nome: 'Instituto Politécnico Horizonte',
  sigla: 'IPH',
  lema: 'Tecnologia que transforma o aprendizado',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 };

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: '#65D80A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
};
