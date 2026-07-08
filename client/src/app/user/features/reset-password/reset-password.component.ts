import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AppValidators } from '../../../shared/utils/validators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly loading = this.authService.loading;
  readonly email = signal('');
  private portal: 'user' | 'admin' = 'user';

  readonly form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, AppValidators.otp]],
    newPassword: ['', [Validators.required, AppValidators.strongPassword]],
    confirmPassword: ['', [Validators.required, AppValidators.matchField('newPassword')]],
  });

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.email.set(params.get('email') ?? '');
    this.portal = params.get('portal') === 'admin' ? 'admin' : 'user';
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { confirmPassword, ...rest } = this.form.getRawValue();
      this.authService.resetPassword({ email: this.email(), ...rest }, this.portal);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
