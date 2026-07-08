import { Component, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AppValidators } from '../../../shared/utils/validators';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  templateUrl: './verify-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly loading = this.authService.loading;
  readonly email = signal('');
  readonly resendCooldown = signal(0);
  private cooldownHandle?: ReturnType<typeof setInterval>;

  readonly form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, AppValidators.otp]],
  });

  ngOnInit(): void {
    this.email.set(this.route.snapshot.queryParamMap.get('email') ?? '');
    this.startCooldown();
  }

  ngOnDestroy(): void {
    if (this.cooldownHandle) clearInterval(this.cooldownHandle);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.authService.verifyEmail({ email: this.email(), otp: this.form.getRawValue().otp });
    } else {
      this.form.markAllAsTouched();
    }
  }

  resend(): void {
    if (this.resendCooldown() > 0 || !this.email()) return;
    this.authService.resendVerification({ email: this.email() });
    this.startCooldown();
  }

  private startCooldown(): void {
    this.resendCooldown.set(30);
    if (this.cooldownHandle) clearInterval(this.cooldownHandle);
    this.cooldownHandle = setInterval(() => {
      this.resendCooldown.update(v => {
        if (v <= 1 && this.cooldownHandle) clearInterval(this.cooldownHandle);
        return Math.max(0, v - 1);
      });
    }, 1000);
  }
}
