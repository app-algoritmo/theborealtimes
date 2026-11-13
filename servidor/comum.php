<?php
// Funções compartilhadas. Não é acessado diretamente.
if (!defined('BT')) { http_response_code(404); exit; }

function cfg() { static $c; return $c ?: $c = require __DIR__ . '/config.php'; }

function db() {
  static $p;
  if ($p) return $p;
  $c = cfg();
  $p = new PDO("mysql:host={$c['db_host']};dbname={$c['db_nome']};charset=utf8mb4", $c['db_user'], $c['db_senha'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
  $p->exec("SET time_zone = '+00:00'");
  return $p;
}

function agora() { return gmdate('Y-m-d H:i:s'); }

function cors() {
  $c = cfg(); $o = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($o && in_array($o, $c['origens'], true)) {
    header("Access-Control-Allow-Origin: $o");
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
  }
  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
}

function json($dados, $codigo = 200) {
  http_response_code($codigo);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($dados);
  exit;
}

function ir($url) { header('Location: ' . $url, true, 303); exit; }

function pagina_site($idioma, $consulta = '') {
  $c = cfg(); $p = $c['paginas'][$idioma] ?? $c['paginas']['pt'];
  return $c['site'] . $p . $consulta;
}

function enviar_email($para, $assunto, $texto, $extra = []) {
  $c = cfg();
  $cab = [
    'From: ' . mb_encode_mimeheader($c['de_nome'], 'UTF-8') . " <{$c['de_email']}>",
    "Reply-To: {$c['responder_para']}",
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: BorealTimes',
  ];
  foreach ($extra as $linha) $cab[] = $linha;
  return mail($para, mb_encode_mimeheader($assunto, 'UTF-8'), $texto, implode("\r\n", $cab), '-f' . $c['de_email']);
}

function limpar_idioma($i) { return $i === 'en' ? 'en' : 'pt'; }
