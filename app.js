
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// ==================================================================
// CLASSE DA ÁRVORE BINÁRIA DE BUSCA COM TRAVESSIAS
// ==================================================================
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return this;
        }
        let current = this.root;
        while (true) {
            if (value === current.value) return undefined; // Ignora duplicados
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }

    find(value, getNodePath = false) {
        if (!this.root) return getNodePath ? [] : false;
        let current = this.root;
        const path = [];
        while (current) {
            path.push(current);
            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            } else {
                return getNodePath ? path : true; // Encontrou
            }
        }
        return getNodePath ? path : false; // Não encontrou
    }

    remove(value) {
        this.root = this._removeNode(this.root, value);
    }

    _removeNode(node, value) {
        if (!node) return null;
        if (value < node.value) {
            node.left = this._removeNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this._removeNode(node.right, value);
            return node;
        } else {
            if (!node.left && !node.right) return null;
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            let temp = this._findMinNode(node.right);
            node.value = temp.value;
            node.right = this._removeNode(node.right, temp.value);
            return node;
        }
    }

    _findMinNode(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    // --- PRÉ-ORDEM (Raiz -> Esquerda -> Direita) ---
    preOrder() {
        const data = [];
        // Chama o método auxiliar recursivo começando pela raiz
        this._preOrderNode(this.root, data);
        return data;
    }

    _preOrderNode(node, data) {
        // A condição de parada da recursão é quando o nó é nulo
        if (node !== null) {
            // 1. Visita a raiz (o nó atual)
            data.push(node.value);
            // 2. Percorre a sub-árvore esquerda
            this._preOrderNode(node.left, data);
            // 3. Percorre a sub-árvore direita
            this._preOrderNode(node.right, data);
        }
    }

    // --- Outras travessias para consistência ---
    inOrder() {
        const data = [];
        this._inOrderNode(this.root, data);
        return data;
    }
    _inOrderNode(node, data) {
        if (node !== null) {
            this._inOrderNode(node.left, data);
            data.push(node.value);
            this._inOrderNode(node.right, data);
        }
    }

    postOrder() {
        const data = [];
        this._postOrderNode(this.root, data);
        return data;
    }
    _postOrderNode(node, data) {
        if (node !== null) {
            this._postOrderNode(node.left, data);
            this._postOrderNode(node.right, data);
            data.push(node.value);
        }
    }

    bfs() {
        const data = [], queue = [];
        if (this.root) queue.push(this.root);
        while (queue.length) {
            let node = queue.shift();
            data.push(node.value);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return data;
    }
}


// ==================================================================
// LÓGICA DA INTERFACE (UI) E ANIMAÇÃO
// ==================================================================
document.addEventListener('DOMContentLoaded', () => {
    const bst = new BinarySearchTree();
    const svg = document.getElementById('tree-svg');
    const valorInput = document.getElementById('valor');
    const logArea = document.getElementById('log');

    const nodeElements = new Map();
    const linkElements = new Map();

    function log(message) {
        logArea.innerHTML += `<p>> ${message}</p>`;
        logArea.scrollTop = logArea.scrollHeight;
    }

    function drawTree() {
        const { width } = svg.getBoundingClientRect();
        const nodeRadius = 20;
        const levelHeight = 70;
        const positions = new Map();
        const nodesToDraw = [];
        const linksToDraw = new Map();

        function calculatePositions(node, x, y, level) {
            if (!node) return;
            positions.set(node.value, { x, y });
            nodesToDraw.push(node);
            const horizontalGap = width / Math.pow(2, level + 2.5);

            if (node.left) {
                const childX = x - horizontalGap;
                const childY = y + levelHeight;
                linksToDraw.set(`${node.value}-${node.left.value}`, { x1: x, y1: y, x2: childX, y2: childY });
                calculatePositions(node.left, childX, childY, level + 1);
            }
            if (node.right) {
                const childX = x + horizontalGap;
                const childY = y + levelHeight;
                linksToDraw.set(`${node.value}-${node.right.value}`, { x1: x, y1: y, x2: childX, y2: childY });
                calculatePositions(node.right, childX, childY, level + 1);
            }
        }

        if (bst.root) {
            calculatePositions(bst.root, width / 2, nodeRadius + 20, 0);
        }

        const nodesInTree = new Set(nodesToDraw.map(n => n.value));
        nodeElements.forEach((el, value) => {
            if (!nodesInTree.has(value)) {
                el.style.opacity = '0';
                el.style.transform = `${el.style.transform} scale(0)`;
                el.addEventListener('transitionend', () => el.remove());
                nodeElements.delete(value);
            }
        });

        nodesToDraw.forEach(node => {
            const { x, y } = positions.get(node.value);
            let g = nodeElements.get(node.value);
            if (!g) {
                g = createNodeElement(node.value, x, y);
                nodeElements.set(node.value, g);
                svg.appendChild(g);
                g.getBoundingClientRect();
            }
            g.style.transform = `translate(${x}px, ${y}px)`;
        });

        linkElements.forEach((el, key) => {
            if (!linksToDraw.has(key)) {
                el.style.opacity = '0';
                el.addEventListener('transitionend', () => el.remove());
                linkElements.delete(key);
            }
        });

        linksToDraw.forEach((pos, key) => {
            let line = linkElements.get(key);
            if (!line) {
                line = createLinkElement(pos.x1, pos.y1);
                linkElements.set(key, line);
                svg.insertBefore(line, svg.firstChild);
                line.getBoundingClientRect();
            }
            line.setAttribute('d', `M${pos.x1},${pos.y1} L${pos.x2},${pos.y2}`);
            line.style.opacity = '1';
        });
    }

   

    function handleAction(action) {
        const value = parseInt(valorInput.value);
        if (isNaN(value)) {
            log('Erro: Por favor, insira um número válido.');
            return;
        }

        switch (action) {
            case 'insert':
                if (bst.find(value)) {
                    log(`Valor ${value} já existe.`);
                } else {
                    bst.insert(value);
                    log(`Valor ${value} inserido.`);
                }
                break;
            case 'remove':
                if (!bst.find(value)) {
                    log(`Valor ${value} não encontrado.`);
                } else {
                    bst.remove(value);
                    log(`Valor ${value} removido.`);
                }
                break;
            case 'search':
                if (bst.find(value)) {
                    log(`Valor ${value} encontrado.`);
                    highlightPath(value);
                } else {
                    log(`Valor ${value} não encontrado.`);
                    highlightPath(value);
                }
                break;
        }
        drawTree();
        valorInput.value = '';
        valorInput.focus();
    }

    // --- Event Listeners ---
    document.getElementById('btnInserir').addEventListener('click', () => handleAction('insert'));
    document.getElementById('btnRemover').addEventListener('click', () => handleAction('remove'));
    document.getElementById('btnBuscar').addEventListener('click', () => handleAction('search'));
    valorInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleAction('insert');
    });
    document.getElementById('btnPreOrdem').addEventListener('click', () => log(`Pré-Ordem: [${bst.preOrder().join(', ')}]`));
    document.getElementById('btnEmOrdem').addEventListener('click', () => log(`Em Ordem: [${bst.inOrder().join(', ')}]`));
    document.getElementById('btnPosOrdem').addEventListener('click', () => log(`Pós-Ordem: [${bst.postOrder().join(', ')}]`));
    document.getElementById('btnLargura').addEventListener('click', () => log(`Busca em Largura: [${bst.bfs().join(', ')}]`));

    new ResizeObserver(drawTree).observe(svg);
    drawTree();
});