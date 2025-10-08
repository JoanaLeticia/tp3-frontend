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

  sugestaoAtual: 'ALMOCO' | 'JANTAR' = 'ALMOCO';
  temAmbasSugestoes: boolean = false;

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

  buscarSugestoesChefe() {
    this.carregandoSugestoes = true;

    this.sugestaoChefeService.findSugestaoAtiva().subscribe({
      next: (sugestao) => {
        console.log('Sugestão do chefe encontrada:', sugestao);

        if (sugestao.itemAlmoco) {
          this.sugestaoAlmoco = this.processarItemSugestao(sugestao.itemAlmoco);
        }

        if (sugestao.itemJantar) {
          this.sugestaoJantar = this.processarItemSugestao(sugestao.itemJantar);
        }

        this.temAmbasSugestoes = !!this.sugestaoAlmoco && !!this.sugestaoJantar;

        if (this.sugestaoAlmoco) {
          this.sugestaoAtual = 'ALMOCO';
        } else if (this.sugestaoJantar) {
          this.sugestaoAtual = 'JANTAR';
        }

        this.carregandoSugestoes = false;
      },
      error: (err) => {
        console.error('Erro ao carregar sugestões do chefe:', err);
        if (err.status !== 404) {
          console.error('Erro detalhado:', err);
        }
        this.carregandoSugestoes = false;
      }
    });
  }

  private processarItemSugestao(item: ItemCardapio): ItemCardapio {
    return {
      ...item,
      urlImagem: this.produtoService.getUrlImagem(item.nomeImagem),
      isSugestaoChefe: true,
      precoComDesconto: this.calcularPrecoComDesconto(item.precoBase)
    };
  }

  private calcularPrecoComDesconto(precoBase: number): number {
    return precoBase * 0.8;
  }

  proximaSugestao() {
    if (!this.temAmbasSugestoes) return;

    this.sugestaoAtual = this.sugestaoAtual === 'ALMOCO' ? 'JANTAR' : 'ALMOCO';
  }

  sugestaoAnterior() {
    if (!this.temAmbasSugestoes) return;

    this.sugestaoAtual = this.sugestaoAtual === 'ALMOCO' ? 'JANTAR' : 'ALMOCO';
  }

  get sugestaoExibida(): ItemCardapio | null {
    if (this.sugestaoAtual === 'ALMOCO') {
      return this.sugestaoAlmoco;
    } else {
      return this.sugestaoJantar;
    }
  }

  buscarProdutosPorPeriodo() {
    this.carregando = true;

    this.produtoService.getByPeriodo(this.periodoSelecionado).subscribe({
      next: (produtos) => {
        console.log('Produtos RAW:', produtos);
        console.log('Primeiro produto:', produtos[0]);
        console.log('Nome da imagem do primeiro produto:', produtos[0]?.nomeImagem);

        this.produtos = produtos.slice(0, 4).map(produto => ({
          ...produto,
          urlImagem: this.produtoService.getUrlImagem(produto.nomeImagem)
        }));

        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.carregando = false;
      }
    });
  }

  alternarPeriodo(periodo: string) {
    this.periodoSelecionado = periodo;
    this.buscarProdutosPorPeriodo();
  }

  adicionarAoCarrinho(produto: ItemCardapio) {
    console.log('Adicionar ao carrinho:', produto);
    alert(`"${produto.nome}" adicionado ao carrinho!`);
  }

  gerarTodosHorarios(): string[] {
    const horarios: string[] = [];
    const inicio = 19 * 60;
    const fim = 22 * 60;
    const intervalo = 15;

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
          const todosHorariosDisponiveis = disponibilidade.flatMap(
            disp => disp.horariosDisponiveis
          );

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

    const dataHora = `${this.dataReserva}T${this.horarioReserva}`;

    this.reservando = true;

    this.reservaService.encontrarMesaDisponivel(this.dataReserva, this.horarioReserva, this.numeroPessoas)
      .subscribe({
        next: (mesa) => {
          if (mesa) {
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

  getDataMinima(): string {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  }

  getDataMaxima(): string {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  }
}