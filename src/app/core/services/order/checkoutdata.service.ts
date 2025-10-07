import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CheckoutDataService {
  private cepSource = new BehaviorSubject<string>('');
  currentCep = this.cepSource.asObservable();

  private freteSource = new BehaviorSubject<any>(null);
  currentFrete = this.freteSource.asObservable();

  private cupomSource = new BehaviorSubject<any>(null);
  currentCupom = this.cupomSource.asObservable();

  constructor() { 
    console.log('[CheckoutDataService] Serviço inicializado');
  }

  changeCep(cep: string) {
    console.log('[CheckoutDataService] Alterando CEP para:', cep);
    this.cepSource.next(cep);
  }

  changeFrete(frete: any) {
    console.log('[CheckoutDataService] Alterando frete para:', frete);
    this.freteSource.next(frete);
  }

  changeCupom(cupom: any) {
    console.log('[CheckoutDataService] Alterando cupom para:', cupom);
    this.cupomSource.next(cupom);
  }

  clearAll() {
    console.log('[CheckoutDataService] Limpando todos os dados');
    this.cepSource.next('');
    this.freteSource.next(null);
    this.cupomSource.next(null);
  }
}