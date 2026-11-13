<?php
define('BT', 1);
require __DIR__ . '/comum.php';

$t = $_GET['t'] ?? '';
$idioma = 'pt';
try {
  if (preg_match('/^[a-f0-9]{64}$/', $t)) {
    $db = db();
    $st = $db->prepare('SELECT id, idioma, estado FROM boreal_assinantes WHERE token_confirma = ?');
    $st->execute([$t]);
    $a = $st->fetch();
    if ($a) {
      $idioma = limpar_idioma($a['idioma']);
      if ($a['estado'] !== 'ativo') {
        $db->prepare("UPDATE boreal_assinantes SET estado='ativo', confirmado_em=? WHERE id=?")->execute([agora(), $a['id']]);
      }
      ir(pagina_site($idioma, '?status=confirmado'));
    }
  }
} catch (Throwable $e) { error_log('boreal confirmar: ' . $e->getMessage()); }
ir(pagina_site($idioma, '?status=expirado'));
