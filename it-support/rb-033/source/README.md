# RB-033 – E-Mails werden blockiert oder als Spam eingestuft (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Auf Basis offizieller Microsoft-Dokumentation recherchiert. **Praktische Validierung noch ausstehend.** Keine produktiven E-Mails freigegeben, keine Sicherheitsrichtlinien verändert; alle Beispielkonten und Fälle sind fiktiv.

## Komplettpaket – genau sechs Dateien

```text
RB-033_E-Mails-blockiert-oder-Spam/
├── README.md
├── RB-033_Lernartikel.md
├── RB-033_Praxis-Runbook.md
└── assets/
    ├── rb033_henne_ei_mailfilter.png
    ├── rb033_diagnosebaum.svg
    └── rb033_diagnosebaum_preview.png
```

| Datei | Inhalt und Verwendung |
|---|---|
| `RB-033_Lernartikel.md` | 15 Kapitel mit EOP/Exchange-Online-Grundlagen, Mailtrace, Junk/Quarantäne/NDR, SPF/DKIM/DMARC, lesenden PowerShell-Beispielen, zwei fiktiven Praxisfällen und Active-Recall-Fragen |
| `RB-033_Praxis-Runbook.md` | 10 praxisnahe Arbeitsabschnitte für L1/L2, Sicherheitsgate, Befundpfade, autorisierte Maßnahmen, Retest und Drei-Satz-Ticketkommentar |
| `assets/rb033_henne_ei_mailfilter.png` | Henne-und-Ei-Infografik im überarbeiteten, professionelleren Stil |
| `assets/rb033_diagnosebaum.svg` | Technischer Diagnosebaum mit getrennten Fehler- und Sicherheitsentscheidungen; skalierbar |
| `assets/rb033_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums für Website und Dokumentation |
| `README.md` | Paketübersicht, Grenzen, Quellen, didaktische Verwendung und Veröffentlichungsinformationen |

**Bildnachweisvorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“. Die Henne-und-Ei-Grafik ist eine didaktische Illustration – kein Screenshot einer realen produktiven Microsoft-365-Umgebung.

## Kerngedanke für die Fehlersuche

**„Mail fehlt“ ist eine Beobachtung, keine Ursache.** Mindestens diese Ergebnisse sind zu trennen:

1. **Kein Exchange-Trace-Ereignis:** mögliche Suchgrenze, Gateway-/Sender- oder Routingproblematik.
2. **Zugestellt, aber nicht sichtbar:** Zielordner/Junk, Postfachregeln und spätere Sicherheitsaktionen (z. B. ZAP).
3. **Junk/Spam:** Inhalts- oder Absenderklassifizierung; Header/SCL/SFV/Regeln prüfen.
4. **Quarantäne:** Sicherheitsbewertung und Freigabeberechtigung vor jeder Aktion klären.
5. **Abweisung / NDR:** SMTP-Fehlercode und verantwortlichen Server auswerten.
6. **Verzögerung:** temporäre Transportfehler, Retry und Connectorstatus nachvollziehen.

**SPF/DKIM/DMARC sind Authentifizierungsbausteine – kein pauschaler Garantiebeweis, dass Mail legitim oder zustellbar ist.**

## Besonderheiten und sichere Arbeitsgrenzen

- **Quarantäne ≠ Freigabe:** Bei Phishing/Malware/hoher Sicherheit keine automatische Freigabe. Defender/SOC entscheidet auf Basis dokumentierter Befunde und Rollen [Q3, Q4].
- **„Delivered“ ≠ im Outlook-Posteingang sichtbar:** Postfachseitige Regeln, Junk und nachträgliche Filteraktionen gesondert prüfen [Q1, Q3].
- **NDR 550 5.7.1 ≠ universeller Spamcode:** Verschiedene Sicherheits-, Empfangs- und Routingbeschränkungen sind möglich [Q6].
- **Kein Treffer im Trace ≠ nie gesendet:** Zeitfenster, sendende Infrastruktur, andere Gateways und verfügbare Historie prüfen [Q1/Q2].
- **Keine breit angelegten Sicherheitsausnahmen**, kein Abschalten von Spam-/Anti-Phishing-/Malware-Filtern, keine willkürlichen DNS-/DMARC-Änderungen.
- PowerShell-Beispiele sind **lesend** und benötigen geeignete Berechtigungen sowie die dokumentierten aktuellen Modulversionen [Q10]. Nicht blind kopieren; Umgebung, Cmdlets und tatsächliches Objekt abgleichen.
- Nur erforderliche **Metadaten** in Tickets. Keine sensiblen Anhänge oder vollständigen Header in ungeschützte Dokumentation übernehmen.

## Konkreter Lern- und Validierungsablauf

1. **Ohne Runbook:** Aus einem kurzen Anwender-Ticket selbstständig mehrere Hypothesen entwickeln.
2. **A/B-Vergleich:** Sichersten Test wählen, der etwa Junk, Quarantäne und externen Reject unterscheidet.
3. **Theorie gegen Praxis:** In einer autorisierten Microsoft-365-Testumgebung bzw. anhand geeigneter anonymisierter Trace-Beispiele Prüfschritte reproduzieren.
4. **Eigenes Runbook formulieren:** Befund, nächster Test, Stoppbedingungen und Eskalationskriterien in eigenen Worten schreiben.
5. **Gegencheck:** Eigene Diagnose mit `RB-033_Praxis-Runbook.md` vergleichen, Fehler und Sicherheitslücken protokollieren.
6. **Wissen aus dem Gedächtnis:** Active-Recall-Fragen aus Kapitel 15 bearbeiten; nach ungefähr 7 und 21 Tagen in neuen Szenarien wiederholen.

Es besteht **keine Aussage**, dass die Beispielkonfigurationen mit realen produktiven Tenants getestet wurden.

## Quellen – Microsoft Learn (abgerufen/recherchiert am 22.11.2026)

- **[Q1]** [Exchange Online – Message Trace im EAC](https://learn.microsoft.com/en-us/exchange/monitoring/trace-an-email-message/message-trace-modern-eac)
- **[Q2]** [Message Trace FAQ / Suchhistorie](https://learn.microsoft.com/en-us/exchange/monitoring/trace-an-email-message/message-trace-faq)
- **[Q3]** [Microsoft Defender – Anti-Spam-Schutz](https://learn.microsoft.com/en-us/defender-office-365/anti-spam-protection-about)
- **[Q4]** [Quarantäne – Administratoraktionen](https://learn.microsoft.com/en-us/defender-office-365/quarantine-admin-manage-messages-files)
- **[Q5]** [Authentifizierung mit SPF, DKIM und DMARC](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-about)
- **[Q6]** [Exchange Online – NDR-Fehler 550 5.7.1](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/ndr/fix-error-code-550-5-7-1-in-exchange-online)
- **[Q7]** [False Positives in Defender behandeln](https://learn.microsoft.com/en-us/defender-office-365/step-by-step-guides/how-to-handle-false-positives-in-microsoft-defender-for-office-365)
- **[Q8]** [Antispam-Nachrichtenheader (SCL, SFV)](https://learn.microsoft.com/en-us/defender-office-365/message-headers-eop-mdo)
- **[Q9]** [Anti-Spam-Policy-Troubleshooting](https://learn.microsoft.com/en-us/defender-office-365/anti-spam-policies-troubleshooting)
- **[Q10]** [Get-MessageTraceV2](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-messagetracev2) und [Get-MessageTraceDetailV2](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-messagetracedetailv2)
- **[Q11]** [Fehlerbehebung bei Mail-Authentifizierung](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-troubleshoot)
- **[Q12]** [Verdächtige Nachrichten oder Fehlalarme zur Analyse einreichen](https://learn.microsoft.com/en-us/defender-office-365/submissions-admin)
- **[Q13]** [Get-QuarantineMessage](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-quarantinemessage)

**Transparenz:** Alle Inhalte sind für Ausbildung und Vorbereitung auf praktische IT-Support-Diagnose erstellt. Der Wahrheitsgehalt einzelner realer Störungsmeldungen muss später durch überprüfbare Labortests oder produktive Befunde geklärt werden. Die GitHub-Pages-Website wurde durch dieses Paket nicht verändert.
