class No {
    constructor(valor) {
        this.valor = valor;       
        this.esquerdo = null;      
        this.direito = null;  
    }
}

class ArvoreBinariaDeBusca {
    //Inicializa a árvore com a raiz nula, indicando uma árvore vazia.
     
    constructor() {
        this.raiz = null;  // O nó raiz da árvore
    }

    //Insere um novo valor na posição correta da árvore, mantendo suas propriedades.
     
    inserir(valor) {
        const novoNo = new No(valor);
        
        // Caso base: se a árvore está vazia, o novo nó se torna a raiz.
        if (!this.raiz) {
            this.raiz = novoNo;
            return this;
        }
        
        // Percorre a árvore para encontrar o local de inserção.
        let atual = this.raiz;
        while (true) {
            // Evita a inserção de valores duplicados, característica de uma ABB.
            if (valor === atual.valor) {
                return undefined; 
            }
            
            // Decide se navega para a sub-árvore esquerda ou direita.
            if (valor < atual.valor) {
                // Se o filho esquerdo é nulo, insere o novo nó aqui.
                if (!atual.esquerdo) {
                    atual.esquerdo = novoNo;
                    return this;
                }
                // Continua a busca na sub-árvore esquerda.
                atual = atual.esquerdo;
            } 
            else {
                // Se o filho direito é nulo, insere o novo nó aqui.
                if (!atual.direito) {
                    atual.direito = novoNo;
                    return this;
                }
                // Continua a busca na sub-árvore direita.
                atual = atual.direito;
            }
        }
    }

    //Busca um valor específico na árvore
    buscar(valor, obterCaminhoDoNo = false) {
        // Se a árvore não possui raiz, o valor não pode ser encontrado.
        if (!this.raiz) {
            return obterCaminhoDoNo ? [] : false;
        }
        
        let atual = this.raiz;
        const caminho = []; // Armazena a sequência de nós visitados durante a busca.
        
        // Percorre a árvore até encontrar o nó ou chegar a um nó nulo.
        while (atual) {
            caminho.push(atual); // Adiciona o nó atual ao caminho.
            
            // Navega de acordo com a propriedade da ABB.
            if (valor < atual.valor) {
                atual = atual.esquerdo;
            } 
            else if (valor > atual.valor) {
                atual = atual.direito;
            } 
            else {
                // Valor encontrado.
                return obterCaminhoDoNo ? caminho : true;
            }
        }
        
        // Valor não encontrado na árvore.
        return obterCaminhoDoNo ? caminho : false;
    }

    //Remove um valor da árvore, reestruturando ela para manter suas propriedades.
    remover(valor) {
        this.raiz = this._removerNo(this.raiz, valor);
    }

    // Método auxiliar recursivo para a remoção de nós.
    _removerNo(no, valor) {
        // Caso base: nó não existe na árvore.
        if (!no) return null;
        
        // Busca o nó a ser removido na sub-árvore apropriada.
        if (valor < no.valor) {
            no.esquerdo = this._removerNo(no.esquerdo, valor);
            return no;
        } 
        else if (valor > no.valor) {
            no.direito = this._removerNo(no.direito, valor);
            return no;
        } 
        else {
            // Nó a ser removido encontrado.
            
            // Caso 1: Nó folha ou com apenas um filho.
            if (!no.esquerdo && !no.direito) {
                return null; // Remove o nó.
            }
            if (!no.esquerdo) return no.direito;  // Retorna o filho direito.
            if (!no.direito) return no.esquerdo;  // Retorna o filho esquerdo.
            
            // Caso 2: Nó com dois filhos.
            // Encontra o menor valor na sub-árvore direita
            let sucessor = this._encontrarMenorNo(no.direito);
            
            // Substitui o valor do nó a ser removido pelo valor do sucessor.
            no.valor = sucessor.valor;
            
            // Remove o sucessor da sub-árvore direita.
            no.direito = this._removerNo(no.direito, sucessor.valor);
            
            return no;
        }
    }

    //Encontra o nó com o menor valor em uma sub-árvore dada.
    _encontrarMenorNo(no) {
        while (no.esquerdo) {
            no = no.esquerdo;
        }
        return no;
    }

    // MÉTODOS DE TRAVESSIA 
    
    //Realiza a travessia Pré-Ordem
    preOrdem() {
        const dados = [];
        this._preOrdemNo(this.raiz, dados);
        return dados;
    }

    // Método auxiliar para a travessia Pré-Ordem.
    _preOrdemNo(no, dados) {
        if (no !== null) {
            dados.push(no.valor); // Visita a raiz.
            this._preOrdemNo(no.esquerdo, dados); // Percorre a sub-árvore esquerda.
            this._preOrdemNo(no.direito, dados); // Percorre a sub-árvore direita.
        }
    }

    //Realiza a travessia Em Ordem
    emOrdem() {
        const dados = [];
        this._emOrdemNo(this.raiz, dados);
        return dados;
    }

    // Método auxiliar para a travessia Em Ordem.
    _emOrdemNo(no, dados) {
        if (no !== null) {
            this._emOrdemNo(no.esquerdo, dados); // Percorre a sub-árvore esquerda.
            dados.push(no.valor); // Visita a raiz.
            this._emOrdemNo(no.direito, dados); // Percorre a sub-árvore direita.
        }
    }

    //Realiza a travessia Pós-Ordem
    posOrdem() {
        const dados = [];
        this._posOrdemNo(this.raiz, dados);
        return dados;
    }

    //Método auxiliar para a travessia Pós-Ordem.
    
    _posOrdemNo(no, dados) {
        if (no !== null) {
            this._posOrdemNo(no.esquerdo, dados); // Percorre a sub-árvore esquerda.
            this._posOrdemNo(no.direito, dados); // Percorre a sub-árvore direita.
            dados.push(no.valor); // Visita a raiz.
        }
    }

    //Realiza a Busca em Largura

    buscaEmLargura() {
        const dados = []; // Armazena os valores dos nós na ordem BFS.
        const fila = []; // Fila para gerenciar os nós a serem visitados.
        
        // Inicia a Busca em largura
        if (this.raiz) {
            fila.push(this.raiz);
        }
        
        // Processa os nós na fila até que ela esteja vazia.
        while (fila.length > 0) {
            let noAtual = fila.shift(); // Remove o primeiro nó da fila.
            
            dados.push(noAtual.valor); // Adiciona o valor do nó atual ao resultado.
            
            // Adiciona os filhos do nó atual à fila para processamento futuro.
            if (noAtual.esquerdo) {
                fila.push(noAtual.esquerdo);
            }
            if (noAtual.direito) {
                fila.push(noAtual.direito);
            }
        }
        
        return dados;
    }

    // Calcula a altura da árvore (o número de níveis do nó raiz até a folha mais distante).
    
    calcularAltura() {
        return this._calcularAlturaNo(this.raiz);
    }

    //Método auxiliar recursivo para calcular a altura de uma sub-árvore.

    _calcularAlturaNo(no) {
        if (!no) return 0; // A altura de um nó nulo é 0.
        
        const alturaEsquerda = this._calcularAlturaNo(no.esquerdo);
        const alturaDireita = this._calcularAlturaNo(no.direito);
        
        // A altura do nó é 1 mais a altura máxima entre suas sub-árvores.
        return Math.max(alturaEsquerda, alturaDireita) + 1;
    }
}

// LÓGICA DA INTERFACE GRÁFICA E ANIMAÇÕES

document.addEventListener('DOMContentLoaded', () => {

    // INICIALIZAÇÃO DE VARIÁVEIS E ELEMENTOS
    
    const arvore = new ArvoreBinariaDeBusca(); // Instância para manipulação de dados.
    
    // Referências aos elementos HTML para interação e renderização.
    const svg = document.getElementById('tree-svg');           // Elemento SVG para renderização gráfica da árvore.
    const campoValor = document.getElementById('valor');       // Campo de entrada para valores numéricos.
    const areaLog = document.getElementById('log');            // Área de exibição para mensagens de log do sistema.
    
    // Mapas para gerenciar os elementos visuais dos nós e ligações no SVG.
    const elementosNos = new Map();      // Mapeia valores de nós para seus elementos SVG correspondentes.
    const elementosLigacoes = new Map(); // Mapeia chaves de ligação (pai-filho) para seus elementos SVG.

    // FUNÇÕES UTILITÁRIAS - Auxiliares para a interface

    function adicionarLog(mensagem) {
        areaLog.innerHTML += `<p>> ${mensagem}</p>`; // Adiciona a mensagem como um novo parágrafo.
        areaLog.scrollTop = areaLog.scrollHeight;    // Garante que a última mensagem esteja visível (auto-scroll).
    }

    // FUNÇÕES DE DESENHO E ANIMAÇÃO DA ÁRVORE 

    // Função principal responsável por desenhar e atualizar a representação visual da árvore no SVG.

    function desenharArvore() {
        // Obtém as dimensões atuais do contêiner da árvore para adaptar o desenho.
        const containerArvore = document.querySelector('.tree-panel');
        const { width: largura, height: altura } = containerArvore.getBoundingClientRect();
        
        // Ajusta o viewBox do SVG para corresponder às dimensões do contêiner, garantindo escalabilidade.
        svg.setAttribute('viewBox', `0 0 ${largura} ${altura}`);
        svg.setAttribute('width', largura);
        svg.setAttribute('height', altura);
        
        // Constantes de layout para o desenho dos nós.
        const raioNo = 20;              // Raio visual dos círculos que representam os nós.
        
        // Calcula a altura ideal entre os níveis da árvore, considerando a altura total disponível
        // e a altura lógica da árvore (número de níveis).
        const alturaArvore = arvore.calcularAltura();
        const alturaEntreniveis = Math.max(50, (altura - 2 * raioNo) / (alturaArvore > 0 ? alturaArvore : 1));
        
        // Estruturas temporárias para armazenar as posições calculadas e os elementos a serem desenhados.
        const posicoes = new Map(); // Mapeia o valor do nó para suas coordenadas (x, y).
        const nosParaDesenhar = []; // Lista de nós que precisam ser renderizados ou atualizados.
        const ligacoesParaDesenhar = new Map(); // Mapeia chaves de ligação para suas coordenadas de início/fim.

        //Função para calcular as coordenadas (x, y) de cada nó na árvore.

        function calcularPosicoes(no, x, y, nivel, offsetHorizontal) {
            if (!no) return; 
            
            // Ajusta a coordenada para garantir que o nó não ultrapasse os limites inferiores do contêiner.
            if (y > altura - raioNo * 2) {
                y = altura - raioNo * 2;
            }
            
            posicoes.set(no.valor, { x, y }); // Armazena a posição calculada para o nó atual.
            nosParaDesenhar.push(no);       // Adiciona o nó à lista de nós a serem desenhados.
            
            // Calcula o espaçamento horizontal para os filhos, que diminui com a profundidade
            const espacamentoHorizontalFilho = offsetHorizontal / 2;

            // Processa o filho esquerdo, se existir.
            if (no.esquerdo) {
                const xFilho = x - espacamentoHorizontalFilho;
                const yFilho = y + alturaEntreniveis;
                
                // Registra as coordenadas da ligação entre o nó pai e o filho esquerdo.
                ligacoesParaDesenhar.set(
                    `${no.valor}-${no.esquerdo.valor}`, 
                    { x1: x, y1: y, x2: xFilho, y2: yFilho }
                );
                
                calcularPosicoes(no.esquerdo, xFilho, yFilho, nivel + 1, espacamentoHorizontalFilho);
            }
            
            // Processa o filho direito, se existir.
            if (no.direito) {
                const xFilho = x + espacamentoHorizontalFilho;
                const yFilho = y + alturaEntreniveis;     
                
                // Registra as coordenadas da ligação entre o nó pai e o filho direito.
                ligacoesParaDesenhar.set(
                    `${no.valor}-${no.direito.valor}`, 
                    { x1: x, y1: y, x2: xFilho, y2: yFilho }
                );
                
                calcularPosicoes(no.direito, xFilho, yFilho, nivel + 1, espacamentoHorizontalFilho);
            }
        }

        // Inicia o cálculo das posições a partir da raiz da árvore, se ela existir.
        if (arvore.raiz) {
            // O offset horizontal inicial é a largura total dividida por 4 (para começar com um bom espaçamento)
            calcularPosicoes(arvore.raiz, largura / 2, raioNo + 20, 0, largura / 4);
        }

        // REMOÇÃO DE ELEMENTOS VISUAIS DE NÓS INEXISTENTES
        
        // Cria um conjunto com os valores dos nós que ainda estão presentes na estrutura de dados da árvore.
        const nosNaArvore = new Set(nosParaDesenhar.map(n => n.valor));
        
        // Itera sobre os elementos visuais existentes e remove aqueles cujos nós correspondentes foram excluídos.
        elementosNos.forEach((elemento, valor) => {
            if (!nosNaArvore.has(valor)) {
                elemento.style.opacity = '0'; // Inicia a animação de fade-out.
                elemento.style.transform = `${elemento.style.transform} scale(0)`; // Inicia a animação de escala.
                
                // Remove o elemento após a conclusão da animação.
                elemento.addEventListener('transitionend', () => elemento.remove());
                
                elementosNos.delete(valor); // Remove o nó do mapa de elementos visuais.
            }
        });

        // CRIAÇÃO E ATUALIZAÇÃO DE ELEMENTOS VISUAIS DOS NÓS
        
        // Processa cada nó que deve ser desenhado.
        nosParaDesenhar.forEach(no => {
            const { x, y } = posicoes.get(no.valor);
            
            let grupoElemento = elementosNos.get(no.valor);
            
            // Se o elemento visual do nó ainda não existe, cria um novo.
            if (!grupoElemento) {
                grupoElemento = criarElementoNo(no.valor, x, y);
                elementosNos.set(no.valor, grupoElemento);
                svg.appendChild(grupoElemento);
                
                grupoElemento.getBoundingClientRect(); // Força o reflow para garantir a animação.
            }
            
            // Atualiza a posição do elemento visual do nó.
            grupoElemento.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        });
        
        // Remove as ligações visuais que não correspondem mais a conexões na árvore.
        elementosLigacoes.forEach((elemento, chave) => {
            if (!ligacoesParaDesenhar.has(chave)) {
                elemento.style.opacity = '0'; // Inicia a animação de fade-out.
                
                // Remove o elemento do DOM após a conclusão da animação.
                elemento.addEventListener('transitionend', () => elemento.remove());
                
                elementosLigacoes.delete(chave); // Remove a ligação do mapa de elementos visuais.
            }
        });

        // Cria ou atualiza as ligações visuais entre os nós.
        ligacoesParaDesenhar.forEach((posicao, chave) => {
            let linha = elementosLigacoes.get(chave);
            
            // Se o elemento visual da ligação ainda não existe, cria um novo.
            if (!linha) {
                linha = criarElementoLigacao(posicao.x1, posicao.y1);
                elementosLigacoes.set(chave, linha);
                
                // Insere a ligação no SVG antes dos nós para garantir a ordem de renderização (fundo).
                svg.insertBefore(linha, svg.firstChild);
                
                linha.getBoundingClientRect(); // Força o reflow para garantir a animação.
            }
            
            // Atualiza o atributo 'd' do path SVG para desenhar a linha entre as posições corretas.
            linha.setAttribute('d', `M${posicao.x1},${posicao.y1} L${posicao.x2},${posicao.y2}`);
            linha.style.opacity = '1'; // Garante que a linha esteja visível.
        });
    }

    //Cria e retorna um elemento SVG para representar visualmente um nó da árvore.

    function criarElementoNo(valor, x, y) {
        const grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupo.setAttribute('class', 'node');
        grupo.dataset.value = valor;
        
        // Define a transformação inicial para a animação de entrada.
        grupo.style.transform = `translate(${x}px, ${y}px) scale(0)`;
        grupo.style.opacity = '0';

        const circulo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circulo.setAttribute('r', 20); // Define o raio do círculo do nó.

        const texto = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        texto.textContent = valor; // Define o texto do nó como seu valor.

        grupo.appendChild(circulo);
        grupo.appendChild(texto);

        // Aplica a animação de entrada após um pequeno atraso para transição suave.
        setTimeout(() => {
            grupo.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            grupo.style.opacity = '1';
        }, 10);

        return grupo;
    }

    
    function criarElementoLigacao(x1, y1) {
        const caminho = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        caminho.setAttribute('class', 'link');
        
        // Inicia a ligação como um ponto para animação de entrada.
        caminho.setAttribute('d', `M${x1},${y1} L${x1},${y1}`);
        caminho.style.opacity = '0';
        
        return caminho;
    }

    // FUNÇÃO DE DESTAQUE VISUAL PARA BUSCA 

    function destacarCaminho(valor) {
        // Remove quaisquer destaques de operações anteriores.
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        
        // Obtém a sequência de nós visitados durante a busca.
        const nosNoCaminho = arvore.buscar(valor, true);
        
        if (!nosNoCaminho || nosNoCaminho.length === 0) return;

        // Aplica o destaque a cada nó e ligação no caminho.
        for (let i = 0; i < nosNoCaminho.length; i++) {
            const elementoNo = elementosNos.get(nosNoCaminho[i].valor);
            
            // Destaca o nó final do caminho se ele corresponde ao valor buscado.
            if (elementoNo && i === nosNoCaminho.length - 1 && nosNoCaminho[i].valor === valor) {
                elementoNo.classList.add('highlight');
            }
            
            // Destaca as ligações entre os nós no caminho.
            if (i > 0) {
                const chaveElementoLigacao = `${nosNoCaminho[i-1].valor}-${nosNoCaminho[i].valor}`;
                const elementoLigacao = elementosLigacoes.get(chaveElementoLigacao);
                if (elementoLigacao) {
                    elementoLigacao.classList.add('highlight');
                }
            }
        }

        // Remove os destaques após um período para visualização temporária.
        setTimeout(() => {
            document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        }, 2500);
    }

    // FUNÇÃO PRINCIPAL PARA PROCESSAR AÇÕES DO USUÁRIO - (inserir, remover, buscar)

    function processarAcao(acao) {
        const valor = parseInt(campoValor.value); // Converte a entrada do usuário para um número inteiro.
        
        // Verifica se o valor é um número válido.
        if (isNaN(valor)) {
            adicionarLog('Erro: Por favor, insira um número válido.');
            return;
        }

        // Executa a operação da Árvore Binária Busca com base na ação solicitada.
        switch (acao) {
            case 'inserir':
                if (arvore.buscar(valor)) {
                    adicionarLog(`Valor ${valor} já existe na árvore.`);
                } else {
                    arvore.inserir(valor);
                    adicionarLog(`Valor ${valor} inserido com sucesso.`);
                }
                break;
                
            case 'remover':
                if (!arvore.buscar(valor)) {
                    adicionarLog(`Valor ${valor} não encontrado na árvore.`);
                } else {
                    arvore.remover(valor);
                    adicionarLog(`Valor ${valor} removido com sucesso.`);
                }
                break;
                
            case 'buscar':
                if (arvore.buscar(valor)) {
                    adicionarLog(`Valor ${valor} encontrado na árvore.`);
                    destacarCaminho(valor); // Visualiza o caminho da busca.
                } else {
                    adicionarLog(`Valor ${valor} não encontrado na árvore.`);
                    destacarCaminho(valor); // Visualiza o caminho mesmo se não encontrado.
                }
                break;
        }
        
        desenharArvore(); // Atualiza a representação visual da árvore após a operação.
        
        campoValor.value = ''; // Limpa o campo de entrada.
        campoValor.focus();    // Retorna o foco para o campo de entrada para facilitar novas operações.
    }

    // CONFIGURAÇÃO DOS EVENTOS DA INTERFACE

    // Associa as funções de processamento de ação aos botões correspondentes.
    document.getElementById('btnInserir').addEventListener('click', () => processarAcao('inserir'));
    document.getElementById('btnRemover').addEventListener('click', () => processarAcao('remover'));
    document.getElementById('btnBuscar').addEventListener('click', () => processarAcao('buscar'));
    
    campoValor.addEventListener('keyup', (evento) => {
        if (evento.key === 'Enter') {
            processarAcao('inserir');
        }
    });
    
    // Associa as funções de travessia aos botões correspondentes, exibindo o resultado no log.
    document.getElementById('btnPreOrdem').addEventListener('click', () => {
        const resultado = arvore.preOrdem();
        adicionarLog(`Pré-Ordem (Raiz→Esq→Dir): [${resultado.join(', ')}]`);
    });
    
    document.getElementById('btnEmOrdem').addEventListener('click', () => {
        const resultado = arvore.emOrdem();
        adicionarLog(`Em Ordem (Esq→Raiz→Dir): [${resultado.join(', ')}]`);
    });
    
    document.getElementById('btnPosOrdem').addEventListener('click', () => {
        const resultado = arvore.posOrdem();
        adicionarLog(`Pós-Ordem (Esq→Dir→Raiz): [${resultado.join(', ')}]`);
    });
    
    document.getElementById('btnLargura').addEventListener('click', () => {
        const resultado = arvore.buscaEmLargura();
        adicionarLog(`Busca em Largura (Por Níveis): [${resultado.join(', ')}]`);
    });

    // INICIALIZAÇÃO DA APLICAÇÃO

    // Utiliza ResizeObserver para detectar mudanças no tamanho do contêiner da árvore
    // e redesenhar a árvore dinamicamente.
    new ResizeObserver(() => {
        setTimeout(desenharArvore, 10); // Pequeno delay para garantir que as dimensões estejam atualizadas.
    }).observe(document.querySelector('.tree-panel'));
    
    desenharArvore(); // Desenha a árvore inicialmente ao carregar a página.
});
