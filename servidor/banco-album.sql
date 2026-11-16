-- Contas do Álbum de Figurinhas (opcional). Rode uma vez no phpMyAdmin do Domeneshop.
-- Guarda só o e-mail, o progresso do álbum e códigos de acesso em forma de hash.
CREATE TABLE IF NOT EXISTS boreal_album_contas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  idioma VARCHAR(2) NOT NULL DEFAULT 'pt',
  consentimento_versao VARCHAR(20) NOT NULL,
  criado_em DATETIME NOT NULL,
  ultimo_link DATETIME NULL
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS boreal_album_tokens (
  hash CHAR(64) NOT NULL PRIMARY KEY,
  conta_id INT UNSIGNED NOT NULL,
  tipo VARCHAR(8) NOT NULL,
  expira_em DATETIME NOT NULL,
  KEY (conta_id), KEY (expira_em)
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS boreal_album_progresso (
  conta_id INT UNSIGNED NOT NULL PRIMARY KEY,
  dados MEDIUMTEXT NOT NULL,
  atualizado_em DATETIME NOT NULL
) CHARACTER SET utf8mb4;
