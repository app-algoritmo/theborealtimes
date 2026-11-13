<?php
// GET: manda o leitor para a página do site, que pede a confirmação.
// POST: cancela de fato. Assim, programas que abrem links de e-mail sozinhos não cancelam ninguém.
define('BT', 1);
require __DIR__ . '/comum.php';
cors();

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$token = $_REQUEST['token'] ?? ($_GET['t'] ?? '');

if ($metodo === 'GET') {
  $idioma = limpar_idioma($_GET['l'] ?? 'pt');
  if (preg_match('/^[a-f0-9]{64}$/', $token)) ir(pagina_site($idioma, '?cancelar=' . $token));
  ir(pagina_site($idioma, '?status=expirado'));
}

if ($metodo !== 'POST') json(['ok' => false], 405);
if (!preg_match('/^[a-f0-9]{64}$/', $token)) json(['ok' => false], 400);

try {
  $st = db()->prepare("UPDATE boreal_assinantes SET estado='cancelado', cancelado_em=? WHERE token_cancela = ? AND estado <> 'cancelado'");
  $st->execute([agora(), $token]);
  if ($st->rowCount() > 0) json(['ok' => true]);
  // Já cancelado antes também conta como sucesso
  $v = db()->prepare("SELECT 1 FROM boreal_assinantes WHERE token_cancela = ? AND estado='cancelado'");
  $v->execute([$token]);
  json(['ok' => (bool)$v->fetchColumn()]);
} catch (Throwable $e) { error_log('boreal cancelar: ' . $e->getMessage()); json(['ok' => false], 500); }
