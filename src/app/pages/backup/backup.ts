import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BackupPayload, BackupService } from '../../core/services/backup';

@Component({
  selector: 'app-backup',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './backup.html',
  styleUrl: './backup.scss',
})
export class Backup {
  status = '';

  constructor(private backup: BackupService) {}

  async export(): Promise<void> {
    try {
      const payload = await this.backup.export();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-financas-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();

      URL.revokeObjectURL(url);
      this.status = 'Backup exportado ✅';
      setTimeout(() => (this.status = ''), 2000);
    } catch {
      this.status = 'Falha ao exportar.';
    }
  }

  async onFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text) as BackupPayload;
      await this.backup.restore(payload);
      this.status = 'Backup restaurado ✅';
      setTimeout(() => (this.status = ''), 2000);
      input.value = '';
    } catch {
      this.status = 'Arquivo inválido ou erro ao restaurar.';
    }
  }
}
