# Qualifica – RI (MVP)

Este repositório contém o MVP estático do Qualifica – RI, incluindo a landing page, a demo interativa e o conjunto completo de checklists normativos.

## Estrutura

```
.
├── index.html              # Landing page principal
├── qualifica-ri-mvp.html   # Variante com mesmo conteúdo (compatibilidade de links)
├── styles/main.css         # Estilos globais do MVP
├── scripts/main.js         # Controlador da demo interativa
├── data/checklists.json    # Fonte original dos checklists
├── data/checklists.js      # Versão embutida no bundle (evita fetch em file://)
├── Dockerfile              # Deploy estático via Nginx
└── nginx.conf              # Configuração do Nginx para o container
```

## Executando localmente

### Usando Docker (recomendado)

```bash
docker build -t qualifica-ri-mvp .
docker run --rm -p 8080:80 qualifica-ri-mvp
```

Depois, acesse `http://localhost:8080`.

### Sem Docker

Qualquer servidor HTTP estático funciona. Exemplo com Python 3:

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080/index.html` no navegador.

> **Importante:** abrir o arquivo diretamente pelo `file://` pode bloquear o carregamento da base de checklists. A versão embutida em `data/checklists.js` garante que o MVP funcione mesmo nesses cenários.

## Deploy

Basta publicar o conteúdo deste diretório em qualquer serviço que sirva arquivos estáticos (S3 + CloudFront, GitHub Pages, Vercel, Netlify, etc.). Se estiver usando o container fornecido:

1. Faça o build (`docker build -t qualifica-ri-mvp .`).
2. Faça push para o seu registro de imagens (`docker tag ... && docker push ...`).
3. Suba a imagem em sua infraestrutura (ECS, Cloud Run, Azure Web App for Containers, etc.).

A configuração do Nginx aplica cache de longo prazo para assets e evita erro 404 para a base `JSON`.

## Scripts auxiliares

Para atualizar `data/checklists.js` após alterações no `JSON`, execute:

```bash
python3 tools/update_checklists_js.py
```

Veja em [Ferramentas](#ferramentas) como gerar esse utilitário.

## Ferramentas

O script `tools/update_checklists_js.py` pode ser usado para converter automaticamente o JSON em um arquivo JavaScript incorporável.

```bash
python3 tools/update_checklists_js.py
```
