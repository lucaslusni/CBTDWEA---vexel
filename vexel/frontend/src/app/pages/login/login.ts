import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',                        // seletor do componente (usado no HTML se fosse embutido)
  standalone: true,                             // componente standalone (não precisa ser declarado em módulo)
  imports: [CommonModule, ReactiveFormsModule], // módulos que esse componente precisa
  templateUrl: './login.html',                  // template HTML do login
  styleUrls: ['./login.scss'],                  // estilos específicos desse componente
})
export class Login {
  // Formulário reativo do login
  loginForm: FormGroup;
  // Flag para exibir estado de carregamento no botão
  loading = false;
  // Erro genérico (se quiser usar pra coisas não relacionadas ao Firebase)
  error: string | null = null;
  // Erro retornado especificamente pela autenticação Firebase
  authError: string | null = null;

  constructor(
    private fb: FormBuilder,   // helper para montar o FormGroup
    private auth: Auth,        // instância do Auth do Firebase (injeção do AngularFire)
    private router: Router     // para redirecionar após login bem-sucedido
  ) {
    // Monta o formulário com os campos e suas validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],     // campo obrigatório e formato de email
      password: ['', [Validators.required, Validators.minLength(6)]], // senha obrigatória e min 6 caracteres
      remember: [false],                                        // checkbox "lembrar-me" (sem validação)
    });
  }

  // Getter para facilitar o acesso ao FormControl de email no template
  get email() {
    return this.loginForm.get('email')!;
  }

  // Getter para facilitar o acesso ao FormControl de senha no template
  get password() {
    return this.loginForm.get('password')!;
  }

  // Handler do submit do formulário
  async onSubmit() {
    // Se o formulário for inválido, não faz nada
    if (this.loginForm.invalid) return;

    this.loading = true;   // ativa estado de loading (desabilita botão / mostra "Entrando...")
    this.error = null;     // limpa erro genérico
    this.authError = null; // limpa erro de autenticação

    const { email, password } = this.loginForm.value; // pega os valores informados

    try {
      // Tenta logar no Firebase com email/senha
      await signInWithEmailAndPassword(this.auth, email, password);
      // Se deu certo, redireciona para a rota de veículos
      this.router.navigate(['/vehicles']);
    } catch (err: any) {
      // Se der erro, traduz o código do Firebase para uma mensagem amigável
      this.authError = this.firebaseErrorMessage(err?.code);
    }

    this.loading = false; // desliga o estado de loading (independente de sucesso/erro)
  }

  // Mapeia códigos de erro do Firebase para mensagens em português
  firebaseErrorMessage(code: string) {
    const errors: Record<string, string> = {
      'auth/invalid-email': 'Email inválido.',
      'auth/missing-password': 'Digite a senha.',
      'auth/invalid-credential': 'Credenciais inválidas.',
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
    };

    // Retorna a mensagem mapeada ou uma mensagem padrão
    return errors[code] || 'Erro ao entrar. Tente novamente.';
  }
}
