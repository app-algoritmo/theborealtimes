-- Tabela de assinantes da newsletter do Boreal Times.
-- Rode no phpMyAdmin do Domeneshop, no banco criado para o Boreal (aba SQL).
CREATE TABLE IF NOT EXISTS boreal_assinantes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  idioma CHAR(2) NOT NULL DEFAULT 'pt',
  estado ENUM('pendente','ativo','cancelado') NOT NULL DEFAULT 'pendente',
  token_confirma CHAR(64) NOT NULL,
  token_cancela CHAR(64) NOT NULL,
  consentimento_versao VARCHAR(20) NOT NULL,
  criado_em DATETIME NOT NULL,
  ultimo_envio_confirma DATETIME NULL,
  confirmado_em DATETIME NULL,
  cancelado_em DATETIME NULL,
  UNIQUE KEY u_email (email),
  UNIQUE KEY u_tc (token_confirma),
  UNIQUE KEY u_tx (token_cancela),
  KEY i_estado (estado, criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
