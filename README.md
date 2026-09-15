# PixelCipher Lab

<p align="center">
  <img src="assets/icons/favicon.png" alt="Logo do PixelCipher Lab" width="120">
</p>
Site educacional interativo sobre processamento de imagens, criptografia e esteganografia. O projeto apresenta os conceitos por meio de explicações, exemplos visuais e ferramentas práticas que funcionam diretamente no navegador.

O tema parte da **filtragem de imagens** e dá ênfase à proteção e à ocultação de mensagens: criptografia com AES-GCM e esteganografia pelo método LSB.

## Objetivo

O PixelCipher Lab foi desenvolvido como atividade acadêmica do curso de Ciência da Computação da Universidade Paulista (UNIP). Seu objetivo é ajudar o visitante a:

- Entender pixels, resolução, canais RGB e representação binária;
- Observar os efeitos de filtros em imagens;
- Diferenciar criptografia de esteganografia;
- Esconder e recuperar mensagens em imagens;
- Combinar criptografia e esteganografia em uma experiência prática;
- Revisar o conteúdo por meio de um quiz.

## Funcionalidades

- **Fundamentos:** conceitos necessários para compreender imagens digitais.
- **Filtros:** demonstração interativa de alterações na imagem.
- **Criptografia:** explicação e experimentação da proteção de mensagens.
- **Esteganografia:** demonstração do método LSB para esconder e revelar textos em imagens.
- **Laboratório:** ciclo completo de criptografar uma mensagem, escondê-la em uma imagem PNG e recuperá-la com a senha.
- **Quiz:** dez questões com correção, explicações e revisão das respostas.
- **Sobre:** proposta acadêmica, metodologia, tecnologias e equipe.

## Como funciona o laboratório

Na proteção, o visitante seleciona uma imagem, escreve uma mensagem e define uma senha. A mensagem é criptografada e os dados resultantes são inseridos nos bits menos significativos dos canais RGB. O arquivo final é baixado em **PNG**.

Na recuperação, o visitante seleciona o PNG gerado e informa a mesma senha. O laboratório lê os dados escondidos na imagem e tenta descriptografá-los para apresentar o texto original.

> **Importante:** esteganografia não substitui criptografia. O método LSB esconde dados na imagem, mas não protege, por si só, a leitura de uma mensagem em texto simples. Além disso, editar, redimensionar ou converter o PNG para JPEG pode impedir a recuperação dos dados.

## Tecnologias

- HTML5;
- CSS3;
- JavaScript;
- Canvas API para leitura e modificação de pixels;
- Web Crypto API para criptografia e descriptografia;
- Git e GitHub para versionamento;
- Netlify como plataforma escolhida para publicação.

O site é estático e não depende de Python, banco de dados ou servidor próprio para executar suas funcionalidades.

## Executar localmente

Clone o repositório ou baixe seus arquivos e abra o `index.html` em um navegador. Para testes, também é possível executar a pasta do projeto com um servidor local.

As páginas e os arquivos de CSS, JavaScript e imagens devem permanecer nas posições relativas previstas pelos links do projeto.

## Privacidade

As experiências com imagens, mensagens e senhas são processadas no navegador. O projeto não possui banco de dados para armazenar esses conteúdos e não envia os arquivos selecionados para processamento em um servidor.

O visitante deve baixar a imagem resultante e guardar sua senha caso queira recuperar a mensagem posteriormente.

## Atividade acadêmica

O projeto reúne:

1. **Material didático:** páginas explicativas, exemplos, aplicações interativas e quiz;
2. **Material técnico:** código-fonte em HTML, CSS e JavaScript;
3. **Aplicação prática:** experiências de filtragem, criptografia e esteganografia;
4. **Relatório reflexivo:** documento separado para registrar a atividade de ensino, os participantes, os resultados observados e a reflexão do grupo.

O relatório deve descrever os testes e a experiência realmente realizados, sem presumir resultados antes da aplicação.

## Equipe

- Paulo Rogério Vigario Filho;
- Theo Vinicius Rezende Panella;
- Pedro Henrique de Souza Fonseca.

**Professor da disciplina:** Danilo R. P.

**Instituição:** Universidade Paulista — UNIP  
**Curso:** Ciência da Computação  
**Disciplina:** Processamento de Imagens e Visão Computacional  
**Ano:** 2026

## Publicação

O projeto foi preparado para publicação como site estático no Netlify. Após a publicação, o endereço do site pode ser acrescentado nesta seção.
