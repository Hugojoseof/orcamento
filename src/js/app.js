/**
 * Gerador de Orçamentos - Aplicação Principal
 * @author Hugo José
 * @version 1.0.0
 */

import { OrcamentoGenerator } from './modules/OrcamentoGenerator.js';
import { NotificationService } from './services/NotificationService.js';
import { StorageService } from './services/StorageService.js';

class App {
    constructor() {
        this.orcamentoGenerator = null;
        this.notificationService = null;
        this.storageService = null;
    }

    /**
     * Inicializa a aplicação
     */
    async init() {
        try {
            console.log('🚀 Iniciando Gerador de Orçamentos...');
            
            // Inicializar serviços
            this.notificationService = new NotificationService();
            this.storageService = new StorageService();
            
            // Inicializar gerador de orçamentos
            this.orcamentoGenerator = new OrcamentoGenerator(
                this.notificationService,
                this.storageService
            );
            
            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
            } else {
                this.onDOMReady();
            }
            
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            this.showError('Erro ao carregar a aplicação. Recarregue a página.');
        }
    }

    /**
     * Executado quando o DOM está pronto
     */
    onDOMReady() {
        try {
            console.log('✅ DOM carregado, inicializando componentes...');
            
            // Inicializar gerador de orçamentos
            this.orcamentoGenerator.init();
            
            console.log('🎉 Aplicação inicializada com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar componentes:', error);
            this.showError('Erro ao inicializar componentes.');
        }
    }

    /**
     * Mostra erro crítico
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #dc2626;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 9999;
            font-family: Inter, sans-serif;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }
}

// Inicializar aplicação quando o script for carregado
const app = new App();
app.init();

// Exportar para uso global se necessário
window.App = app; 