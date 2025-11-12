import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaSuccess?: (token: string) => void;
    onRecaptchaExpired?: () => void;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule,  CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  isSubmitting = false;
  submitStatus: { type: 'success' | 'error', message: string } | null = null;
  recaptchaToken: string | null = null;
  recaptchaError: string | null = null;

  recaptchaSiteKey = '6LcjqwIsAAAAAKkFy0JXG_0vSTEDuVdctliJczzZ';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRecaptcha();
  }

  ngOnDestroy(): void {
    delete window.onRecaptchaSuccess;
    delete window.onRecaptchaExpired;
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{8,}$/)]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  loadRecaptcha(): void {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.onRecaptchaSuccess = (token: string) => {
      this.recaptchaToken = token;
      this.recaptchaError = null;
    };

    window.onRecaptchaExpired = () => {
      this.recaptchaToken = null;
      this.recaptchaError = 'reCAPTCHA expirado. Por favor, verifica nuevamente.';
    };
  }

  async onSubmit() {
  Object.keys(this.contactForm.controls).forEach(key => {
    this.contactForm.get(key)?.markAsTouched();
  });

  if (!this.contactForm.valid) {
    this.submitStatus = {
      type: 'error',
      message: 'Por favor corrige los errores del formulario'
    };
    return;
  }

  if (!this.recaptchaToken) {
    this.submitStatus = {
      type: 'error',
      message: 'Debes completar el reCAPTCHA'
    };
    return;
  }

  const payload = {
    ...this.contactForm.value,
    recaptchaToken: this.recaptchaToken
  };

  console.log("ENVIANDO AL BACKEND:", payload);

  try {
    const res = await fetch('http://localhost:3000/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      this.submitStatus = {
        type: 'error',
        message: data.message || 'Error al enviar formulario'
      };
      return;
    }

    this.submitStatus = {
      type: 'success',
      message: 'Formulario enviado correctamente'
    };

    this.resetForm();
  } catch (error) {
    this.submitStatus = {
      type: 'error',
      message: 'Error de conexión al backend'
    };
  }
}

  private simulateSubmit(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Datos del formulario:', {
          ...this.contactForm.value,
          recaptchaToken: this.recaptchaToken
        });
        resolve();
      }, 2000);
    });
  }

  private resetForm(): void {
    this.contactForm.reset();
    this.recaptchaToken = null;
    this.recaptchaError = null;

    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }

    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.setErrors(null);
      this.contactForm.get(key)?.markAsUntouched();
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `El ${fieldName} es requerido`;
    if (field.errors['minlength']) return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    if (field.errors['email']) return 'Email inválido';
    if (field.errors['pattern']) {
      if (fieldName === 'name') return 'Solo letras permitidas';
      if (fieldName === 'phone') return 'Teléfono inválido';
    }

    return 'Campo inválido';
  }

  getFieldClass(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    const isTextarea = fieldName === 'message';
    const baseClass = isTextarea ? 'form-textarea' : 'form-input';

    if (field?.touched && field.invalid) return `${baseClass} error`;
    if (field?.touched && field.valid) return `${baseClass} success`;

    return baseClass;
  }

  getCharCount(): string {
    const msg = this.contactForm.get('message')?.value || '';
    return `${msg.length}/1000`;
  }

async sendToBackend() {
  const payload = {
    ...(this.contactForm?.value ?? {}),
    recaptchaToken: this.recaptchaToken ?? null,
  };

  try {
    const res = await fetch('http://localhost:3000/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Error backend:', err);
      throw new Error('Error en el servidor');
    }
    console.log("Enviando payload al backend:", payload);

    const data = await res.json();
    console.log('Guardado:', data);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

}


