import { Component, NgModule, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GridProdutos } from '../grid-produtos/grid-produtos';
import { ItemCardapio } from '../../../core/models/item-cardapio.model';
import { ActivatedRoute } from '@angular/router';
import { ItemCardapioService } from '../../../core/services/pratos/item-cardapio.service';
import { CommonModule } from '@angular/common';
import { SugestaoChefeService } from '../../../core/services/pratos/sugestao-chefe.service';
import { ReservaService, DisponibilidadeMesa } from '../../../core/services/reserva/reserva.service';
import { FormsModule } from '@angular/forms';
import { LoginModalComponent } from '../../modais/login/login';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, GridProdutos, CommonModule, FormsModule, LoginModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  produtos: ItemCardapio[] = [];
  sugestaoAlmoco: ItemCardapio | null = null;
  sugestaoJantar: ItemCardapio | null = null;
  periodoSelecionado: string = 'ALMOCO';
  carregando: boolean = false;
  carregandoSugestoes: boolean = false;

  // Variáveis para controle do carrossel
  sugestaoAtual: 'ALMOCO' | 'JANTAR' = 'ALMOCO';
  temAmbasSugestoes: boolean = false;

  // Variáveis para reserva
  reservando: boolean = false;
  dataReserva: string = '';
  horarioReserva: string = '';
  numeroPessoas: number = 2;
  carregandoHorarios: boolean = false;

  dataReservaObj?: Date;
  minDate: Date = new Date();
  maxDate: Date = new Date();

  mostrarLoginModal: boolean = false;
  mostrarRegistroModal: boolean = false;

  // Horários pré-definidos (19:00 às 22:00, de 15 em 15 minutos)
  horariosDisponiveis: string[] = [];

  todosHorarios: string[] = this.gerarTodosHorarios();

  constructor(
    private route: ActivatedRoute,
    private produtoService: ItemCardapioService,
    private sugestaoChefeService: SugestaoChefeService,
    private reservaService: ReservaService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.buscarProdutosPorPeriodo();
      this.buscarSugestoesChefe();
    });
  }

  abrirLogin() {
    this.mostrarLoginModal = true;
  }

  fecharLoginModal() {
    this.mostrarLoginModal = false;
  }

  abrirRegistro() {
    this.mostrarLoginModal = false;
    this.mostrarRegistroModal = true;
  }

  fecharRegistroModal() {
    this.mostrarRegistroModal = false;
  }

  // Buscar sugestões do chefe
  buscarSugestoesChefe() {
    this.carregandoSugestoes = true;

    this.sugestaoChefeService.findSugestaoAtiva().subscribe({
      next: (sugestao) => {
        console.log('Sugestão do chefe encontrada:', sugestao);

        // Processar sugestão do almoço
        if (sugestao.itemAlmoco) {
          this.sugestaoAlmoco = this.processarItemSugestao(sugestao.itemAlmoco);
        }

        // Processar sugestão do jantar
        if (sugestao.itemJantar) {
          this.sugestaoJantar = this.processarItemSugestao(sugestao.itemJantar);
        }

        // Verificar se temos ambas as sugestões
        this.temAmbasSugestoes = !!this.sugestaoAlmoco && !!this.sugestaoJantar;

        // Definir sugestão inicial baseada na disponibilidade
        if (this.sugestaoAlmoco) {
          this.sugestaoAtual = 'ALMOCO';
        } else if (this.sugestaoJantar) {
          this.sugestaoAtual = 'JANTAR';
        }

        this.carregandoSugestoes = false;
      },
      error: (err) => {
        console.error('Erro ao carregar sugestões do chefe:', err);
        // Se for 404 (não encontrado), não é erro, só não há sugestão ativa
        if (err.status !== 404) {
          console.error('Erro detalhado:', err);
        }
        this.carregandoSugestoes = false;
      }
    });
  }

  // Processar item da sugestão (aplica desconto e URL da imagem)
  private processarItemSugestao(item: ItemCardapio): ItemCardapio {
    return {
      ...item,
      urlImagem: this.produtoService.getUrlImagem(item.nomeImagem),
      isSugestaoChefe: true,
      precoComDesconto: this.calcularPrecoComDesconto(item.precoBase)
    };
  }

  // Calcular preço com desconto (20% off)
  private calcularPrecoComDesconto(precoBase: number): number {
    return precoBase * 0.8;
  }

  // Métodos do carrossel
  proximaSugestao() {
    if (!this.temAmbasSugestoes) return;

    this.sugestaoAtual = this.sugestaoAtual === 'ALMOCO' ? 'JANTAR' : 'ALMOCO';
  }

  sugestaoAnterior() {
    if (!this.temAmbasSugestoes) return;

    this.sugestaoAtual = this.sugestaoAtual === 'ALMOCO' ? 'JANTAR' : 'ALMOCO';
  }

  // Verificar qual sugestão deve ser exibida
  get sugestaoExibida(): ItemCardapio | null {
    if (this.sugestaoAtual === 'ALMOCO') {
      return this.sugestaoAlmoco;
    } else {
      return this.sugestaoJantar;
    }
  }

  // Método para buscar produtos por período
  buscarProdutosPorPeriodo() {
    this.carregando = true;

    this.produtoService.getByPeriodo(this.periodoSelecionado).subscribe({
      next: (produtos) => {
        console.log(`Produtos carregados para período ${this.periodoSelecionado}:`, produtos);
        this.produtos = produtos.slice(0, 4);
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.carregando = false;
      }
    });
  }

  // Método para alternar entre Almoço e Jantar
  alternarPeriodo(periodo: string) {
    this.periodoSelecionado = periodo;
    this.buscarProdutosPorPeriodo();
  }

  // Adicionar ao carrinho
  adicionarAoCarrinho(produto: ItemCardapio) {
    console.log('Adicionar ao carrinho:', produto);
    // Implementar lógica do carrinho aqui
    alert(`"${produto.nome}" adicionado ao carrinho!`);
  }

  gerarTodosHorarios(): string[] {
    const horarios: string[] = [];
    const inicio = 19 * 60; // 19:00 em minutos
    const fim = 22 * 60;    // 22:00 em minutos
    const intervalo = 15;   // 15 minutos

    for (let minuto = inicio; minuto <= fim; minuto += intervalo) {
      const horas = Math.floor(minuto / 60);
      const minutos = minuto % 60;
      horarios.push(`${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`);
    }
    return horarios;
  }

  onDadosReservaChange() {
    if (this.dataReserva && this.numeroPessoas > 0) {
      this.buscarHorariosDisponiveis();
    } else {
      this.horariosDisponiveis = [];
      this.horarioReserva = '';
    }
  }

  buscarHorariosDisponiveis() {
    this.carregandoHorarios = true;
    this.horariosDisponiveis = [];
    this.horarioReserva = '';

    this.reservaService.verificarDisponibilidade(this.dataReserva, this.numeroPessoas)
      .subscribe({
        next: (disponibilidade) => {
          // Extrair todos os horários disponíveis de todas as mesas
          const todosHorariosDisponiveis = disponibilidade.flatMap(
            disp => disp.horariosDisponiveis
          );

          // Remover duplicatas e ordenar
          this.horariosDisponiveis = [...new Set(todosHorariosDisponiveis)].sort();
          this.carregandoHorarios = false;

          console.log(`Encontrados ${this.horariosDisponiveis.length} horários disponíveis`);
        },
        error: (err) => {
          console.error('Erro ao buscar horários disponíveis:', err);
          this.horariosDisponiveis = [];
          this.carregandoHorarios = false;
        }
      });
  }

  fazerReserva() {
    if (!this.dataReserva || !this.horarioReserva || !this.numeroPessoas) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // O sistema escolherá a mesa automaticamente
    const dataHora = `${this.dataReserva}T${this.horarioReserva}`;

    this.reservando = true;

    // Primeiro, encontre uma mesa disponível para este horário
    this.reservaService.encontrarMesaDisponivel(this.dataReserva, this.horarioReserva, this.numeroPessoas)
      .subscribe({
        next: (mesa) => {
          if (mesa) {
            // Criar reserva com a mesa encontrada
            const reservaDTO = {
              dataHora: dataHora,
              idMesa: mesa.id,
              numeroPessoas: this.numeroPessoas
            };

            this.reservaService.create(reservaDTO).subscribe({
              next: (reserva) => {
                alert(`Reserva confirmada! \nMesa: ${mesa.numero} (${mesa.capacidade} pessoas)\nCódigo: ${reserva.codigoConfirmacao}`);
                this.resetarFormularioReserva();
                this.reservando = false;
              },
              error: (err) => {
                console.error('Erro ao fazer reserva:', err);
                alert('Erro ao fazer reserva. Tente novamente.');
                this.reservando = false;
              }
            });
          } else {
            alert('Não há mesas disponíveis para o horário selecionado. Por favor, escolha outro horário.');
            this.reservando = false;
          }
        },
        error: (err) => {
          console.error('Erro ao encontrar mesa:', err);
          alert('Erro ao verificar disponibilidade. Tente novamente.');
          this.reservando = false;
        }
      });
  }

  resetarFormularioReserva() {
    this.dataReserva = '';
    this.horarioReserva = '';
    this.numeroPessoas = 2;
    this.horariosDisponiveis = [];
  }

  // Métodos auxiliares para datas
  getDataMinima(): string {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  }

  getDataMaxima(): string {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 dias no futuro
    return maxDate.toISOString().split('T')[0];
  }
}