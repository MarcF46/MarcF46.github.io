# RB-044 – BitLocker-Recovery wird angefordert (L1/L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle  
**Stand:** 22.11.2026 · **Paketversion:** 1.0  
**Validierungsstatus:** Recherchierte, theoretisch nachvollzogene Fallanalyse; **noch nicht praktisch validiert**. Szenarien sind fiktiv.

## Paketinhalt – 6 Dateien

1. `RB-044_Lernartikel.md` – 15 ausführliche Kapitel: BitLocker, TPM, Ursachen, Recovery-Quellen, sicherer Ablauf, zwei fiktive Fallbeispiele, Lernfragen.
2. `RB-044_Praxis-Runbook.md` – 10 kompakte, supportfähige Arbeitsschritte mit Stoppkriterien und Musterticket.
3. `assets/rb044_henne_ei_bitlocker_recovery.png` – Henne-und-Ei-Infografik (16:9, stilistisch im RB-026–RB-045-Design).
4. `assets/rb044_diagnosebaum.svg` – Technischer, skalierbarer Entscheidungsbaum.
5. `assets/rb044_diagnosebaum_preview.png` – PNG-Vorschau für Website und Lernunterlagen.
6. `README.md` – dieses Verzeichnis, Quellen und Sicherheitsregeln.

## Was ist bei der Veröffentlichung wichtig?

- Die Markdown-Bildverweise sind **relativ** zu `assets/` und bleiben erhalten, wenn die gesamte Ordnerstruktur übernommen wird.
- Die beiden Bildtypen haben unterschiedliche Rollen: Die Henne-und-Ei-Grafik ist ein visueller Lernanker; der SVG-Diagnosebaum dient als technischer Ablaufplan.
- Veröffentlichen als recherchiertes Projektmaterial, **nicht** als vollständig praktisch validierte Reparaturanleitung.
- Bei der Veröffentlichung der Henne-und-Ei-Grafik gegebenenfalls kennzeichnen: „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.
- **Keine tatsächlichen BitLocker-RecoveryPasswords, realen Nutzerkonten oder ungeschützten Recovery-Dateien** in README, Website, Bildern oder Tickets ablegen.

## Zentrale Sicherheitsregeln

- Identität und Gerät **vor Schlüsselabruf** nach Firmenverfahren prüfen.
- **Key ID ist nicht das RecoveryPassword**; immer den passenden Datensatz auswählen.
- Keinen 48-stelligen Schlüssel im Ticket, Chat, Screenshot oder Log speichern.
- Keine TPM-Löschung, keine willkürlichen BIOS-/Secure-Boot-Änderungen, keine Neuinstallation oder Deaktivierung von BitLocker auf Verdacht.
- Wenn Schlüssel fehlt oder nicht eindeutig ist, **STOP und Eskalation**; keine seriöse Abkürzung versprechen.
- Nach erfolgreichem Start Ursache und erneuten Neustart prüfen. Wenn Schlüssel eventuell offenbart wurde, RecoveryPassword-Rotation nur nach Securityfreigabe und mit geprüfter neuer Hinterlegung.

## Quellen und Nachprüfbarkeit

Die vollständigen Herstellerlinks mit Kennzeichnung `[Q1]` bis `[Q10]` stehen am Ende des Lernartikels; Grundlage sind ausschließlich offizielle Microsoft-Support- und Microsoft-Learn-Dokumente (zuletzt geprüft am 22.11.2026).

**Verbindlicher Projektstatus:** Vorbereitende Dokumentation abgeschlossen; praktische Prüfung ausstehend. Das Repository und die bestehende Website werden durch dieses ZIP **nicht** verändert.
