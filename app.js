/**
 * SIMULADOR INTERATIVO DE ÁRVORE BINÁRIA DE BUSCA
 * 
 * Este arquivo contém a implementação completa de uma árvore binária de busca
 * com interface visual interativa, incluindo operações de inserção, remoção,
 * busca e diferentes tipos de travessias.
 */

// CLASSE NÓ - Representa cada elemento da árvore

/**
 * Classe que representa um nó individual da árvore binária
 * Cada nó contém um valor e referências para os nós filhos (esquerdo e direito)
 */
class No {
    /**
     * Construtor do nó
     * @param {number} valor - O valor numérico que será armazenado no nó
     */
    constructor(valor) {
        this.valor = valor;        // Valor armazenado no nó
        this.esquerdo = null;      // Referência para o nó filho à esquerda
        this.direito = null;       // Referência para o nó filho à direita
    }
}

// ==================================================================
// CLASSE ÁRVORE BINÁRIA DE BUSCA - Estrutura de dados principal
// ==================================================================

/**
 * Classe que implementa uma Árvore Binária de Busca
 * 
 * Propriedades da Árovre Binária de Busca:
 * - Todos os valores à esquerda de um nó são menores que o valor do nó
 * - Todos os valores à direita de um nó são maiores que o valor do nó
 * - Essas propriedades se aplicam a todas as sub-árvores
 */
class ArvoreBinariaDeBusca {
    /**
     * Construtor da árvore - inicializa com raiz vazia
     */
    constructor() {
        this.raiz = null;  // A raiz da árvore
    }

    /**
     *  essa função insere um novo valor na árvore
     * @param {number} valor - Valor a ser inserido
     * @returns {ArvoreBinariaDeBusca|undefined} - Retorna a própria árvore ou nada se valor duplicado
     */
    inserir(valor) {
        // Cria um novo nó com o valor fornecido
        const novoNo = new No(valor);
        
        // Se a árvore está vazia, o novo nó se torna a raiz
        if (!this.raiz) {
            this.raiz = novoNo;
            return this;
        }
        
        // Percorre a árvore para encontrar a posição correta
        let atual = this.raiz;
        while (true) {
            // Não permite valores duplicados
            if (valor === atual.valor) {
                return undefined; // Ignora duplicados
            }
            
            // Se o valor é menor, vai para a esquerda
            if (valor < atual.valor) {
                // Se não há nó à esquerda, insere aqui
                if (!atual.esquerdo) {
                    atual.esquerdo = novoNo;
                    return this;
                }
                // Continua navegando à esquerda
                atual = atual.esquerdo;
            } 
            // Se o valor é maior, vai para a direita
            else {
                // Se não há nó à direita, insere aqui
                if (!atual.direito) {
                    atual.direito = novoNo;
                    return this;
                }
                // Continua navegando à direita
                atual = atual.direito;
            }
        }
    }

    /**
     * Busca um valor na árvore
     * @param {number} valor - Valor a ser buscado
     * @param {boolean} obterCaminhoDoNo - Se true, retorna o caminho percorrido até o nó
     * @returns {boolean|Array} - true/false se encontrou, ou array com caminho se solicitado
     */
    buscar(valor, obterCaminhoDoNo = false) {
        // Se a árvore está vazia
        if (!this.raiz) {
            return obterCaminhoDoNo ? [] : false;
        }
        
        let atual = this.raiz;
        const caminho = []; // Array para armazenar o caminho percorrido
        
        // Percorre a árvore seguindo as regras da ensinadas de 
        while (atual) {
            caminho.push(atual); // Adiciona o nó atual ao caminho
            
            // Se o valor buscado é menor, vai para a esquerda
            if (valor < atual.valor) {
                atual = atual.esquerdo;
            } 
            // Se o valor buscado é maior, vai para a direita
            else if (valor > atual.valor) {
                atual = atual.direito;
            } 
            // Encontrou o valor
            else {
                return obterCaminhoDoNo ? caminho : true;
            }
        }
        
        // Não encontrou o valor
        return obterCaminhoDoNo ? caminho : false;
    }

    /**
     * Remove um valor da árvore mantendo as propriedades da Árvore Binária de Busca
     * @param {number} valor - Valor a ser removido
     */
    remover(valor) {
        this.raiz = this._removerNo(this.raiz, valor);
    }

    /**
     * Método auxiliar recursivo para remoção de nós
     * @param {No} no - Nó atual sendo analisado
     * @param {number} valor - Valor a ser removido
     * @returns {No|null} - O nó atualizado após a remoção
     */
    _removerNo(no, valor) {
        // Caso base: nó não existe
        if (!no) return null;
        
        // Se o valor é menor, continua na sub-árvore esquerda
        if (valor < no.valor) {
            no.esquerdo = this._removerNo(no.esquerdo, valor);
            return no;
        } 
        // Se o valor é maior, continua na sub-árvore direita
        else if (valor > no.valor) {
            no.direito = this._removerNo(no.direito, valor);
            return no;
        } 
        // Encontrou o nó a ser removido
        else {
            // Caso 1: Nó folha (sem filhos)
            if (!no.esquerdo && !no.direito) {
                return null;
            }
            
            // Caso 2: Nó com apenas um filho
            if (!no.esquerdo) return no.direito;  // Só tem filho direito
            if (!no.direito) return no.esquerdo;  // Só tem filho esquerdo
            
            // Caso 3: Nó com dois filhos
            // Encontra o sucessor (menor valor na sub-árvore direita)
            let sucessor = this._encontrarMenorNo(no.direito);
            
            // Substitui o valor do nó pelo valor do sucessor
            no.valor = sucessor.valor;
            
            // Remove o sucessor da sub-árvore direita
            no.direito = this._removerNo(no.direito, sucessor.valor);
            
            return no;
        }
    }

    /**
     * Encontra o nó com menor valor em uma sub-árvore
     * @param {No} no - Nó raiz da sub-árvore
     * @returns {No} - Nó com menor valor
     */
    _encontrarMenorNo(no) {
        // O menor valor sempre está na extrema esquerda
        while (no.esquerdo) {
            no = no.esquerdo;
        }
        return no;
    }

    // MÉTODOS DE TRAVESSIA

    /**
     * TRAVESSIA PRÉ-ORDEM (Raiz → Esquerda → Direita)
     * Visita primeiro a raiz, depois a sub-árvore esquerda, por fim a direita
     
      @returns {Array} - Array com valores na ordem de visitação
     */
    preOrdem() {
        const dados = [];
        // Chama o método auxiliar começando pela raiz
        this._preOrdemNo(this.raiz, dados);
        return dados;
    }

    /**
     * Método auxiliar para travessia pré-ordem
     * @param {No} no - Nó atual sendo visitado
     * @param {Array} dados - Array para armazenar os valores visitados
     */
    _preOrdemNo(no, dados) {
        // Condição de parada: nó nulo
        if (no !== null) {
            // 1. Visita a raiz (nó atual)
            dados.push(no.valor);
            // 2. Percorre a sub-árvore esquerda
            this._preOrdemNo(no.esquerdo, dados);
            // 3. Percorre a sub-árvore direita
            this._preOrdemNo(no.direito, dados);
        }
    }

    /**
     * TRAVESSIA EM ORDEM (Esquerda → Raiz → Direita)
     * Visita primeiro a sub-árvore esquerda, depois a raiz, por fim a direita
     
      @returns {Array} - Array com valores em ordem crescente
     */
    emOrdem() {
        const dados = [];
        this._emOrdemNo(this.raiz, dados);
        return dados;
    }

    /**
     * Método auxiliar para travessia em ordem
     * @param {No} no - Nó atual sendo visitado
     * @param {Array} dados - Array para armazenar os valores visitados
     */
    _emOrdemNo(no, dados) {
        if (no !== null) {
            // 1. Percorre a sub-árvore esquerda
            this._emOrdemNo(no.esquerdo, dados);
            // 2. Visita a raiz (nó atual)
            dados.push(no.valor);
            // 3. Percorre a sub-árvore direita
            this._emOrdemNo(no.direito, dados);
        }
    }

    /**
     * TRAVESSIA PÓS-ORDEM (Esquerda → Direita → Raiz)
     * Visita primeiro as sub-árvores filhas, depois a raiz
     
       @returns {Array} - Array com valores na ordem pós-ordem
     */
    posOrdem() {
        const dados = [];
        this._posOrdemNo(this.raiz, dados);
        return dados;
    }

    /**
     * Método que auxilia na travessia pós-ordem
     * @param {No} no - Nó atual sendo visitado
     * @param {Array} dados - Array para armazenar os valores visitados
     */
    _posOrdemNo(no, dados) {
        if (no !== null) {
            // 1. Percorre a sub-árvore esquerda
            this._posOrdemNo(no.esquerdo, dados);
            // 2. Percorre a sub-árvore direita
            this._posOrdemNo(no.direito, dados);
            // 3. Visita a raiz (nó atual)
            dados.push(no.valor);
        }
    }

    /**
     * BUSCA EM LARGURA
     * Visita os nós nível por nível, da esquerda para a direita
     * @returns {Array} - Array com valores na ordem de visitação por níveis
     */
    buscaEmLargura() {
        const dados = []; // Array para armazenar os valores visitados
        const fila = []; // Fila para controlar a ordem de visitação
        
        // Se a árvore não está vazia, adiciona a raiz na fila
        if (this.raiz) {
            fila.push(this.raiz);
        }
        
        // Enquanto houver nós na fila
        while (fila.length > 0) {
            // Remove o primeiro nó da fila
            let noAtual = fila.shift();
            
            // Adiciona o valor do nó atual ao resultado
            dados.push(noAtual.valor);
            
            // Adiciona os filhos na fila
            if (noAtual.esquerdo) {
                fila.push(noAtual.esquerdo);
            }
            if (noAtual.direito) {
                fila.push(noAtual.direito);
            }
        }
        
        return dados;
    }
}

// LÓGICA DA INTERFACE GRÁFICA E ANIMAÇÕES

document.addEventListener('DOMContentLoaded', () => {

    // INICIALIZAÇÃO DE VARIÁVEIS E ELEMENTOS
    
    // Cria uma nova instância da árvore binária de busca
    const arvore = new ArvoreBinariaDeBusca();
    
    // Obtém referências para os elementos HTML da interface
    const svg = document.getElementById('tree-svg');           // Elemento SVG para desenhar a árvore
    const campoValor = document.getElementById('valor');       // Campo de entrada para valores
    const areaLog = document.getElementById('log');            // Área para exibir mensagens de log
    
    // Maps para armazenar elementos visuais da árvore
    const elementosNos = new Map();      // Armazena os elementos visuais dos nós
    const elementosLigacoes = new Map(); // Armazena os elementos visuais das ligações entre nós

    // FUNÇÕES UTILITÁRIAS

    /**
     * Adiciona uma mensagem ao log da interface
     * @param {string} mensagem
     */
    function adicionarLog(mensagem) {
        // Adiciona a mensagem com formatação
        areaLog.innerHTML += `<p>> ${mensagem}</p>`;
        // Faz scroll automático para mostrar a mensagem mais recente
        areaLog.scrollTop = areaLog.scrollHeight;
    }

    // FUNÇÕES DE DESENHO E ANIMAÇÃO DA ÁRVORE

    /**
     * Função principal para desenhar a árvore visualmente no SVG
     * Calcula posições, cria elementos visuais e aplica animações
     */
    function desenharArvore() {
        // Obtém as dimensões do elemento SVG
        const { width: largura } = svg.getBoundingClientRect();
        
        // Constantes para o layout visual
        const raioNo = 20;              // Raio dos círculos que representam os nós
        const alturaEntreniveis = 70;
        
        // Estruturas para armazenar informações de layout
        const posicoes = new Map();         // Posições (x, y) de cada nó
        const nosParaDesenhar = [];         // Lista de nós que devem ser desenhados
        const ligacoesParaDesenhar = new Map(); // Ligações entre nós pai e filho

        /**
         * Função que serve para calcular as posições de todos os nós
         * @param {No} no - Nó atual sendo posicionado
         * @param {number} x - Posição horizontal do nó
         * @param {number} y - Posição vertical do nó
         * @param {number} nivel - Nível atual na árvore
         */
        function calcularPosicoes(no, x, y, nivel) {
            // Condição de parada: nó nulo
            if (!no) return;
            
            // Armazena a posição do nó atual
            posicoes.set(no.valor, { x, y });
            nosParaDesenhar.push(no);
            
            // Calcula o espaçamento horizontal baseado no nível
            // Níveis mais profundos têm menos espaço horizontal
            const espacamentoHorizontal = largura / Math.pow(2, nivel + 2.5);

            // Posiciona o filho esquerdo (se existir)
            if (no.esquerdo) {
                const xFilho = x - espacamentoHorizontal;  // À esquerda do pai
                const yFilho = y + alturaEntreniveis;      // Um nível abaixo
                
                // Cria a ligação visual entre pai e filho
                ligacoesParaDesenhar.set(
                    `${no.valor}-${no.esquerdo.valor}`, 
                    { x1: x, y1: y, x2: xFilho, y2: yFilho }
                );
                
                // Chama para o filho esquerdo
                calcularPosicoes(no.esquerdo, xFilho, yFilho, nivel + 1);
            }
            
            // Posiciona o filho direito (se existir)
            if (no.direito) {
                const xFilho = x + espacamentoHorizontal;  // À direita do pai
                const yFilho = y + alturaEntreniveis;      // Um nível abaixo
                
                // Cria a ligação visual entre pai e filho
                ligacoesParaDesenhar.set(
                    `${no.valor}-${no.direito.valor}`, 
                    { x1: x, y1: y, x2: xFilho, y2: yFilho }
                );
                
                // Chama recursivamente para o filho direito
                calcularPosicoes(no.direito, xFilho, yFilho, nivel + 1);
            }
        }

        // Se a árvore não está vazia, calcula as posições começando pela raiz
        if (arvore.raiz) {
            calcularPosicoes(arvore.raiz, largura / 2, raioNo + 20, 0);
        }

        // REMOÇÃO DE ELEMENTOS QUE NÃO EXISTEM MAIS NA ÁRVORE
        
        // Cria um conjunto com os valores dos nós que ainda existem na árvore
        const nosNaArvore = new Set(nosParaDesenhar.map(n => n.valor));
        
        // Remove elementos visuais de nós que foram deletados da árvore
        elementosNos.forEach((elemento, valor) => {
            if (!nosNaArvore.has(valor)) {
                // Aplica a animação de saída do nó
                elemento.style.opacity = '0';
                elemento.style.transform = `${elemento.style.transform} scale(0)`;
                
                // Remove o elemento após a animação
                elemento.addEventListener('transitionend', () => elemento.remove());
                
                // Remove da estrutura de controle
                elementosNos.delete(valor);
            }
        });

        // CRIAÇÃO E ATUALIZAÇÃO DE ELEMENTOS VISUAIS DOS NÓS
        
        // Para cada nó que deve ser desenhado
        nosParaDesenhar.forEach(no => {
            const { x, y } = posicoes.get(no.valor);
            
            // Verifica se o elemento visual já existe
            let grupoElemento = elementosNos.get(no.valor);
            
            // Se não existe, cria um novo elemento
            if (!grupoElemento) {
                grupoElemento = criarElementoNo(no.valor, x, y);
                elementosNos.set(no.valor, grupoElemento);
                svg.appendChild(grupoElemento);
                
                grupoElemento.getBoundingClientRect();
            }
            
            // Atualiza a posição do elemento
            grupoElemento.style.transform = `translate(${x}px, ${y}px)`;
        });

        // CRIAÇÃO E ATUALIZAÇÃO DE LIGAÇÕES ENTRE NÓS
        
        // Remove ligações que não existem mais
        elementosLigacoes.forEach((elemento, chave) => {
            if (!ligacoesParaDesenhar.has(chave)) {
                // Aplica animação de saída
                elemento.style.opacity = '0';
                
                // Remove o elemento após a animação
                elemento.addEventListener('transitionend', () => elemento.remove());
                
                // Remove da estrutura de controle
                elementosLigacoes.delete(chave);
            }
        });

        // Cria ou atualiza as ligações existentes
        ligacoesParaDesenhar.forEach((posicao, chave) => {
            let linha = elementosLigacoes.get(chave);
            
            // Se a ligação não existe, cria uma nova
            if (!linha) {
                linha = criarElementoLigacao(posicao.x1, posicao.y1);
                elementosLigacoes.set(chave, linha);
                
                // Insere a ligação antes dos nós (para ficar atrás visualmente)
                svg.insertBefore(linha, svg.firstChild);
                
                // Força um reflow
                linha.getBoundingClientRect();
            }
            
            // Atualiza a posição da linha
            linha.setAttribute('d', `M${posicao.x1},${posicao.y1} L${posicao.x2},${posicao.y2}`);
            linha.style.opacity = '1';
        });
    }

    /**
     * Cria um elemento visual SVG para representar um nó da árvore
     * @param {number} valor - Valor do nó
     * @param {number} x - Posição horizontal
     * @param {number} y - Posição vertical
     * @returns {SVGElement} - Elemento SVG do nó
     */
    function criarElementoNo(valor, x, y) {
        // Cria um grupo SVG para conter o círculo e o texto
        const grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupo.setAttribute('class', 'node');
        grupo.dataset.value = valor;
        
        // Inicia com escala 0 e opacidade 0 para animação de entrada
        grupo.style.transform = `translate(${x}px, ${y}px) scale(0)`;
        grupo.style.opacity = '0';

        // Cria o círculo que representa o nó
        const circulo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circulo.setAttribute('r', 20); // Raio do círculo

        // Cria o texto com o valor do nó
        const texto = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        texto.textContent = valor;

        // Adiciona os elementos ao grupo
        grupo.appendChild(circulo);
        grupo.appendChild(texto);

        // Aplica animação de entrada após um pequeno delay
        setTimeout(() => {
            grupo.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            grupo.style.opacity = '1';
        }, 10);

        return grupo;
    }

    /**
     * Cria um elemento visual SVG para representar uma ligação entre nós
     * @param {number} x1 - Posição x inicial
     * @param {number} y1 - Posição y inicial
     * @returns {SVGElement} - Elemento SVG da ligação
     */
    function criarElementoLigacao(x1, y1) {
        // Cria uma linha SVG
        const caminho = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        caminho.setAttribute('class', 'link');
        
        // Inicia como um ponto (linha de comprimento zero)
        caminho.setAttribute('d', `M${x1},${y1} L${x1},${y1}`);
        caminho.style.opacity = '0';
        
        return caminho;
    }

    // FUNÇÃO DE DESTAQUE VISUAL PARA BUSCA

    /**
     * Destaca o caminho percorrido durante uma busca
     * @param {number} valor - Valor que foi buscado
     */
    function destacarCaminho(valor) {
        // Remove destaques anteriores
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        
        // Obtém o caminho percorrido durante a busca
        const nosNoCaminho = arvore.buscar(valor, true);
        
        // Se não há caminho, não faz nada
        if (!nosNoCaminho || nosNoCaminho.length === 0) return;

        // Destaca cada nó no caminho
        for (let i = 0; i < nosNoCaminho.length; i++) {
            const elementoNo = elementosNos.get(nosNoCaminho[i].valor);
            
            // Destaca o nó final se foi encontrado
            if (elementoNo && i === nosNoCaminho.length - 1 && nosNoCaminho[i].valor === valor) {
                elementoNo.classList.add('highlight');
            }
            
            // Destaca as ligações no caminho
            if (i > 0) {
                const chaveElementoLigacao = `${nosNoCaminho[i-1].valor}-${nosNoCaminho[i].valor}`;
                const elementoLigacao = elementosLigacoes.get(chaveElementoLigacao);
                if (elementoLigacao) {
                    elementoLigacao.classList.add('highlight');
                }
            }
        }

        // Remove o destaque depois de um curto espaço de tempo
        setTimeout(() => {
            document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        }, 2500);
    }

    // FUNÇÃO PRINCIPAL PARA PROCESSAR AÇÕES DO USUÁRIO

    /**
     * Processa as ações do usuário (inserir, remover, buscar)
     * @param {string} acao
     */
    function processarAcao(acao) {
        // Obtém e valida o valor inserido pelo usuário
        const valor = parseInt(campoValor.value);
        
        // Verifica se o valor é um número válido
        if (isNaN(valor)) {
            adicionarLog('Erro: Por favor, insira um número válido.');
            return;
        }

        // Executa a ação solicitada
        switch (acao) {
            case 'inserir':
                // Verifica se o valor já existe antes de inserir
                if (arvore.buscar(valor)) {
                    adicionarLog(`Valor ${valor} já existe na árvore.`);
                } else {
                    arvore.inserir(valor);
                    adicionarLog(`Valor ${valor} inserido com sucesso.`);
                }
                break;
                
            case 'remover':
                // Verifica se o valor existe antes de tentar remover
                if (!arvore.buscar(valor)) {
                    adicionarLog(`Valor ${valor} não encontrado na árvore.`);
                } else {
                    arvore.remover(valor);
                    adicionarLog(`Valor ${valor} removido com sucesso.`);
                }
                break;
                
            case 'buscar':
                // Realiza a busca e informa o resultado
                if (arvore.buscar(valor)) {
                    adicionarLog(`Valor ${valor} encontrado na árvore.`);
                    destacarCaminho(valor); // Destaca o caminho visualmente
                } else {
                    adicionarLog(`Valor ${valor} não encontrado na árvore.`);
                    destacarCaminho(valor); // Mostra o caminho percorrido mesmo sem encontrar
                }
                break;
        }
        
        // Atualiza a visualização da árvore
        desenharArvore();
        
        // Limpa o campo de entrada e retorna o foco para ele
        campoValor.value = '';
        campoValor.focus();
    }

    // CONFIGURAÇÃO DOS EVENTOS DA INTERFACE

    // Botões de operações básicas
    document.getElementById('btnInserir').addEventListener('click', () => processarAcao('inserir'));
    document.getElementById('btnRemover').addEventListener('click', () => processarAcao('remover'));
    document.getElementById('btnBuscar').addEventListener('click', () => processarAcao('buscar'));
    
    // Permite inserir pressionando Enter no campo de valor
    campoValor.addEventListener('keyup', (evento) => {
        if (evento.key === 'Enter') {
            processarAcao('inserir');
        }
    });
    
    // Botões de travessias - cada um executa um tipo diferente de percurso
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

    // INICIALIZAÇÃO

    // Observa mudanças no tamanho do SVG e redesenha a árvore quando necessário
    // Isso garante que a árvore se adapte quando a janela é redimensionada
    new ResizeObserver(desenharArvore).observe(svg);
    
    // Desenha a árvore
    desenharArvore();
});
