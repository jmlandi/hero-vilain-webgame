const {createApp} = Vue;

createApp({
    data() {
        return {
            heroi: {vida: 100, dano: 0, defesa: 0},
            vilao: {vida: 100, dano: 0, defesa: 0, dificuldade: 3},
            logAcoes: [],
            heroiAcaoAndamento: false
        }
    },
    methods: {

        async realizarAcao(acao, tipo) {
            if (this.heroiAcaoAndamento && tipo == "heroi") return;
            if (tipo == "heroi") this.resetStatus();
            this.heroiAcaoAndamento = true;
            switch (acao) {
                case 'atacar':
                    this.atacar(tipo);
                    break;
                case 'defender':
                    this.defender(tipo);    
                    break;
                case 'usarPocao':
                    await this.usarPocao(tipo);
                    break;
                case 'correr':
                    this.correr(tipo);
                    break;
                default:
                    console.error("Ação inválida.");
            }
            if (tipo == "heroi") await this.acaoVilao()
            if (tipo == "vilao") this.resultadoDano();
            if (this.vilao.vida <= 0) {
                this.vilao.vida = 0;
                this.registrarAcao("Vilão morreu.")
                this.reiniciarJogo("ganhou");
            } else if (this.heroi.vida <= 0) {
                this.heroi.vida = 0;
                this.registrarAcao("Heroi morreu.")
                this.reiniciarJogo("perdeu");
            }
            this.heroiAcaoAndamento = false;
        },

        async resetStatus() {
            this.heroi.dano = 0,
            this.heroi.defesa = 0,
            this.vilao.dano = 0,
            this.vilao.defesa = 0
        },

        async resultadoDano() {
            danoHeroi = this.vilao.dano - this.heroi.defesa;
            danoVilao = this.heroi.dano - this.vilao.defesa;
            if (danoHeroi < 0) danoHeroi = 0;
            if (danoVilao < 0) danoVilao = 0;
            this.heroi.vida -= danoHeroi;
            this.vilao.vida -= danoVilao;
            this.registrarAcao(`DANOS: Herói ${danoHeroi} de dano & Vilão ${danoVilao} de dano.`)
        },

        async atacar(tipo) {
            const poder = [15, 16, 17, 18, 19, 20, 25];
            let dano = poder[Math.floor(Math.random() * poder.length)];
            if (tipo == "heroi") {
                this.heroi.dano = dano;
                this.registrarAcao(`HERÓI: ataque com ${dano} de dano ao Vilão.`);
            }
            if (tipo == "vilao") {
                dano += this.vilao.dificuldade;
                this.vilao.dano = dano;
                this.registrarAcao(`VILÃO: ataque com ${dano} de dano ao Herói.`);
            }
        },

        async defender(tipo) {
            const defesa = [5, 9, 10, 11, 15];
            let danoReduzido = defesa[Math.floor(Math.random() * defesa.length)];
            if (tipo == 'heroi') {
                this.heroi.defesa = danoReduzido;
                this.registrarAcao(`HERÓI: defesa ${danoReduzido} de dano.`);
            }
            if (tipo == "vilao") {
                danoReduzido += this.vilao.dificuldade;
                this.vilao.defesa = danoReduzido
                this.registrarAcao(`VILÃO: defesa ${danoReduzido} de dano.`);
            }
        },

        async usarPocao(tipo) {
            const pocoes = [10, 12, 13, 14, 15, 20];
            const cura = pocoes[Math.floor(Math.random() * pocoes.length)];
            if (tipo == "heroi") {
                if (this.heroi.vida < 100) {
                    this.registrarAcao(`HERÓI: usou poção e recuperou ${cura} de vida.`);
                    this.heroi.vida += cura;
                    if (this.heroi.vida > 100) this.heroi.vida = 100;
                } else {
                    this.registrarAcao(`HERÓI: usou poção, mas está com a vida cheia.`);
                }
            }
            if (tipo == "vilao") {
                this.vilao.vida += cura;
                    if (this.vilao.vida > 100) this.vilao.vida = 100;
                this.registrarAcao(`VILÃO: usou poção e recuperou ${cura} de vida.`);
            }
        },

        async correr() {
            const chancesCorrer = 0.5;
            const tentativaCorrer = Math.random();
            if (tentativaCorrer <= chancesCorrer) {
                this.registrarAcao("HERÓI: conseguiu escapar do combate.");
                this.reiniciarJogo("reiniciou");
            } else {
                this.registrarAcao("HERÓI: tentou escapar do combate, mas não conseguiu!");
            }
        },

        async acaoVilao() {
            let acoes = ['atacar', 'defender'];
            if (this.vilao.vida <= 80) acoes = ['atacar', 'defender', 'usarPocao'];
            const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
            console.log("ação vilão: ", {acaoAleatoria});
            await this.realizarAcao(acaoAleatoria, 'vilao');
        },

        registrarAcao(acao) {
            console.log(acao)
            this.logAcoes.push(acao);
        },

        reiniciarJogo(tipo) {
            this.resetStatus();
            this.heroi.vida = 100;
            this.vilao.vida = 100;
            this.logAcoes = [];
            if (tipo == "perdeu") {
                alert("GAME OVER!");
            } else if (tipo == "ganhou") {
                alert("VOCÊ VENCEU!")
            } else if (tipo == "reiniciou") {
                alert("O HERÓI FUGIU")
            } else {
                alert("JOGO REINICIADO!")
            }
        }
    }
}).mount("#app")