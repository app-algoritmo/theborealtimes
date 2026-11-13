<?php
// Copie este arquivo para config.php e preencha. NUNCA suba config.php para o Git.
return [
  // Banco criado no painel do Domeneshop para o Boreal Times
  'db_host' => 'NOME_DO_BANCO.mysql.domeneshop.no',
  'db_nome' => 'NOME_DO_BANCO',
  'db_user' => 'USUARIO',
  'db_senha' => 'SENHA',

  // Remetente. Use um endereço de um domínio que o Domeneshop envia (veja LEIA-ME.md)
  'de_email' => 'post@borealtimes.org',
  'de_nome' => 'The Boreal Times',
  'responder_para' => 'post@borealtimes.org',

  // Onde este script está publicado (sem barra no fim) e onde fica o site
  'base_url' => 'https://api.dsnorge.com/boreal',
  'site' => 'https://borealtimes.org',
  'paginas' => ['pt' => '/assinatura/', 'en' => '/en/subscribe/', 'no' => '/no/abonner/'],

  // Quem pode chamar o formulário
  'origens' => ['https://borealtimes.org', 'https://www.borealtimes.org'],

  // Versão do texto de consentimento mostrado no site (mude quando o texto mudar)
  'consentimento_versao' => '2026-11-13',

  // Máximo de inscrições novas aceitas a cada 10 minutos (freio contra abuso)
  'limite_10min' => 60,

  // Senha para rodar enviar.php pelo terminal (Unix shell). Troque por algo longo.
  'segredo' => 'TROQUE-ISTO',
];
