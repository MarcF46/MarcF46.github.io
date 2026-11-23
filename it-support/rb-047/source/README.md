# RB-047 – TLS-Zertifikat ungültig oder abgelaufen (L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle  
**Stand:** 23.11.2026 · **Paketversion:** 1.0  
**Validierungsstatus:** Recherchiert und theoretisch nachvollzogen; **noch nicht praktisch validiert**. Sämtliche Hosts, Netzwerkadressen und Störungsbeispiele sind fiktiv.

## Paketstruktur – genau sechs Dateien

| Datei | Inhalt |
|---|---|
| `RB-047_Lernartikel.md` | 15 Kapitel: HTTPS/TLS, SNI, SAN, Gültigkeitsdauer, Chain, IIS/Proxy-Bindungen, Windows/PowerShell/OpenSSL, zwei fiktive Fälle, Active Recall |
| `RB-047_Praxis-Runbook.md` | 10 Abschnitte: L2-Ticketaufnahme, Sicherheitscheck, leise/lesende Tests, Entscheidungsmatrix, genehmigte Korrektur, Retest, Ticketabschluss |
| `assets/rb047_henne_ei_tls_zertifikat.png` | Henne-und-Ei-Infografik im professionelleren Comic-/Infografikstil |
| `assets/rb047_diagnosebaum.svg` | Skalierbarer technischer Diagnosebaum mit verschiedenen Fehlerpfaden |
| `assets/rb047_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums für Website und Lernunterlagen |
| `README.md` | Diese Datei, Hauptaussagen, Quellen und Veröffentlichungshinweise |

## Merksätze und diagnostische Abgrenzungen

- **TCP 443 erreichbar ≠ TLS korrekt ≠ Zertifikat gültig ≠ HTTP-Anwendung funktionsfähig.**
- Das **remote ausgelieferte** Zertifikat ist entscheidend – nicht nur das Zertifikat im lokalen Server-Zertifikatspeicher.
- Für Zertifikatsprüfung sind **Gültigkeitsfenster, Hostname/SAN, Zertifikatskette und Clientvertrauen** separat zu bestätigen.
- `-servername` setzt SNI; `-verify_hostname` prüft den erwarteten Hostnamen bei `openssl s_client`.
- Für IIS/Proxy/Load Balancer müssen **Listener, TLS-Terminierung, SNI/Hostbindung und Zertifikats-Fingerprint** passen.
- **Nie** Zertifikatswarnungen umgehen, unbekannte Root-CAs global installieren oder TLS-Sicherheitsprüfungen ohne Freigabe abschalten.
- **Keine privaten Schlüssel, PFX-Passwörter, Session-Cookies oder Tokens im Ticket** speichern.

## Didaktischer Ablauf zur späteren Validierung

1. Das fiktive Eingangsticket lesen, ohne den Lösungsabschnitt zu sehen. Fehlerebene und erste Diagnosehypothesen selbst formulieren.
2. Erwartete Ergebnisse für DNS, TCP, TLS-Handshake, SAN, `notAfter` und Zertifikatskette vorhersagen.
3. Nur **in einer eigenen isolierten Testumgebung** mit genehmigten Testzertifikaten, Test-CA und bewusst falschem SAN oder unvollständiger Kette nachstellen.
4. Im Labor den Unterschied zwischen **ausgestelltem**, **installiertem** und **wirklich ausgeliefertem** Zertifikat nachweisen.
5. Eigenes Runbook und präzisen Ticketkommentar schreiben; danach mit dem Praxis-Runbook und den Herstellerquellen vergleichen.
6. Active-Recall-Fragen als Wissens-, Verständnis- und Diagnosekarten auswählen, nach ca. 7/21 Tagen neue Varianten testen.

**Praxisgrenze:** Ohne reale Zertifikatsverwaltungsrechte kann die serverseitige Renewal-/Binding-Arbeit nicht als praktisch validiert gelten. Die lokale X.509-Auswertung ist unabhängig davon im Labor übbar.

## Hersteller-/Spezifikationsquellen, recherchiert am 23.11.2026

1. Microsoft – Backend-Zertifikats- und TLS-Prüfungen: https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting
2. Microsoft – Azure Application Gateway und SNI: https://learn.microsoft.com/en-us/azure/application-gateway/configuration-http-settings
3. Let's Encrypt – Zertifikatsketten: https://letsencrypt.org/certificates/
4. OpenSSL – `s_client`: https://docs.openssl.org/3.4/man1/openssl-s_client/
5. OpenSSL – `x509`: https://docs.openssl.org/3.4/man1/openssl-x509/
6. Microsoft – PowerShell-Zertifikatsanbieter: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/about/about_certificate_provider?view=powershell-7.5
7. Microsoft – IIS-SSL einrichten und Bindungen: https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis
8. Microsoft – `netsh http`: https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netsh-http
9. Microsoft – Schannel-Ereignisprotokollierung: https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/health-diagnostic-performance/enable-schannel-event-logging
10. Microsoft – Zertifikatspfad-/Sperrstatusprüfung: https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/configure-certificate-path-validation-revocation-policy

Die ausführliche Zuordnung `[Q1]`–`[Q11]` findet sich in `RB-047_Lernartikel.md`.

## Für die spätere GitHub-Pages-Veröffentlichung

- Archiv entpacken und **relative Assetpfade** beibehalten oder beim Website-Import gezielt anpassen.
- Die GitHub-Website wird **nicht automatisch** geändert.
- Infografik kennzeichnen: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“**
- Transparenzhinweis: **„Recherchierte und theoretisch nachvollzogene Fallanalyse. Die praktische Validierung der beschriebenen Maßnahmen steht noch aus.“**
- Praktische Befunde erst nach eigenen Tests als validiert markieren; fiktive Musterfälle als fiktiv belassen.
- Keine privaten Zertifikatschlüssel oder echten vertraulichen Host-/Benutzerdaten in öffentliche Dokumentation übernehmen.

**Projektstatus:** RB-047 recherchiert und für spätere Laborvalidierung vorbereitet, **nicht** praktisch abgeschlossen.
