# RB-048 – Remotedesktopverbindung (RDP) schlägt fehl (L1/L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle  
**Stand:** 23.11.2026 · **Paketversion:** 1.0  
**Status:** Herstellerrecherche und theoretisch begründete Diagnose; **nicht praktisch validiert**. Alle Geräte, FQDNs und Störungsfälle sind fiktiv.

## Paketstruktur (genau sechs Dateien)

| Datei | Zweck |
|---|---|
| `RB-048_Lernartikel.md` | 15 Kapitel: Hostfähigkeit, DNS/VPN/Gateway, TCP, Listener, NLA, Benutzerrechte, Sitzungsdiagnose, PowerShell, zwei fiktive Fälle und Active Recall |
| `RB-048_Praxis-Runbook.md` | 10 Arbeitsabschnitte für L1-/L2-Support mit STOP-Kriterien, Diagnosekommandos, Entscheidungsmatrix, Freigabe, Retest und Ticketkommentar |
| `assets/rb048_henne_ei_rdp.png` | Henne-und-Ei-Infografik im professionelleren Stil als grafischer Lernanker |
| `assets/rb048_diagnosebaum.svg` | Skalierbarer technischer RDP-Entscheidungsbaum |
| `assets/rb048_diagnosebaum_preview.png` | PNG-Vorschau zur Einbindung auf Website oder in Lernmaterialien |
| `README.md` | Diese Übersicht: Sicherheit, Lernweg, Quellen, Veröffentlichungsregeln |

## Die wichtigsten Diagnoseunterschiede

- **Server erreichbar ≠ TCP 3389 erreichbar ≠ RDP-Listener aktiv ≠ Authentifizierung erfolgreich ≠ Sitzung funktionsfähig.**
- `Test-NetConnection` prüft den **TCP-Pfad**. Der Befehl prüft nicht die RDP-Anmeldung.
- Auf dem **Zielhost** helfen `qwinsta`, `Get-Service TermService` und `Get-NetTCPConnection`, Dienststatus und Listener getrennt zu bewerten.
- Windows 11 Home unterstützt RDP als **Client**, nicht als integrierten **Host**.
- Bei RD Gateway ist der **Gateway-Pfad** entscheidend: Ein direkter Zugriff vom Client auf den Hostport 3389 kann absichtlich gesperrt sein.
- Bei TCP-Erfolg und Anmeldefehler prüfen wir **NLA, Kontoidentität, Gruppenmitgliedschaften und effektive Benutzerrechte**, nicht blind die Firewall.
- Bei erfolgreicher Anmeldung und sofortigem Abbruch prüfen wir **TerminalServices, Session Host, Benutzerprofil und ggf. RDS-Lizenzierung**.

## Verbindliche Sicherheitsregeln

- RDP nicht direkt dem Internet aussetzen: vorgesehenen VPN- oder RD-Gateway-Zugang verwenden.
- **NLA und Firewall nicht auf Verdacht deaktivieren** und keine pauschale Regel für alle Quelladressen öffnen.
- Keine unnötigen Admin-/RDP-Berechtigungen erteilen; Änderungen nur nach Genehmigung und nachvollziehbarer Zuständigkeit.
- Nie `TermService` oder produktive RDS-Sitzungen ohne Freigabe und Folgenabschätzung neu starten.
- Vor jedem Eingriff Konsole/alternativen Managementzugang, aktuelle Sitzungen, Backup bzw. Rollback und Wartungsfenster klären.
- Keine Kennwörter, Tokens oder unnötigen Benutzerinformationen in Tickets und Laborunterlagen speichern.

## Lernmethode für die spätere Validierung

1. Nur fiktives Eingangsticket lesen und **mindestens drei** unterschiedliche Hypothesen formulieren.
2. Den zu erwartenden Output für DNS, TCP-Verbindung, Listener und RDP-Anmeldung **vor der Prüfung** vorhersagen.
3. In einer **isolierten, genehmigten Testumgebung** zwei VMs nutzen; die Ziel-VM benötigt eine unterstützte Windows-Edition und alternativen Konsolenzugang.
4. Jeweils nur eine Störung simulieren (zum Beispiel RDP in den **Test-VM-Einstellungen** deaktiviert oder eine **gezielte Labor-Firewallregel**).
5. Nur lesende Diagnosen durchführen; Ursache nennen und durch einen Gegencheck belegen.
6. Nach kontrollierter Laborkorrektur **echte Anmeldung und Anwendungsfunktion** prüfen, nicht nur Port 3389.
7. Eigenes Runbook und einen präzisen Ticketkommentar verfassen; anschließend mit dem Muster vergleichen.
8. Auswahl von Wissens-, Verständnis- und Diagnosekarten, später neue Störungsvarianten nach etwa **7 und 21 Tagen** testen.

**Grenze der Übung:** Wenn keine RDS-Farm und kein RD Gateway vorhanden sind, können Lizenzierungs-/Broker-/Gatewayzweige nur anhand offizieller Quellen oder einer passenden weiteren Testumgebung untersucht werden. Das darf nicht als praktisch validiert ausgewiesen werden.

## Offizielle Herstellerquellen, geprüft am 23.11.2026

1. Microsoft – Remotedesktop einschalten, unterstützte Host-Editionen und NLA: https://learn.microsoft.com/de-de/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-allow-access
2. Microsoft – Zielhost, Listener, RDP-Port und Netzwerkfehler: https://learn.microsoft.com/de-de/troubleshoot/windows-server/remote/remote-desktop-cannot-connect-remote-computer
3. Microsoft – Allgemeine RDP-Fehlerdiagnose: https://learn.microsoft.com/de-de/windows-server/remote/remote-desktop-services/troubleshoot/rdp-error-general-troubleshooting
4. Microsoft – Ports für Remote Desktop Services: https://learn.microsoft.com/de-de/troubleshoot/windows-server/remote/ports-used-by-rds
5. Microsoft – Anmeldetypen und Benutzerrechte: https://learn.microsoft.com/de-de/troubleshoot/windows-server/remote/system-admin-restrict-types-logon
6. Microsoft – RDP über ein anderes Netz, VPN/Internet: https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-allow-outside-access
7. Microsoft – `Test-NetConnection`: https://learn.microsoft.com/de-de/powershell/module/nettcpip/test-netconnection?view=windowsserver2022-ps
8. Microsoft – RDS-Lizenzierung: https://learn.microsoft.com/de-de/troubleshoot/windows-server/remote/troubleshoot-rds-licensing-guidance
9. Microsoft – Entra-verbundenes Gerät: https://learn.microsoft.com/de-de/windows/client-management/client-tools/connect-to-remote-aadj-pc

Die Zuordnung `[Q1]`–`[Q12]` steht im ausführlichen Lernartikel.

## Veröffentlichung auf GitHub Pages

- Im ZIP sind die Assetpfade **relativ**. Dateien beim späteren Import gemeinsam übernehmen oder die Pfade bewusst anpassen.
- **Die Website wird durch die Erstellung dieses ZIP nicht verändert.**
- Bildkennzeichnung beibehalten: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“**
- Transparenzhinweis: **„Recherchierte und theoretisch nachvollzogene Fallanalyse. Die praktische Validierung steht noch aus.“**
- Fiktive Namen, IP-Adressen und Übungsbefunde klar als solche kenntlich machen.
- Erst nach tatsächlichen und dokumentierten Labortests einzelne Schritte als praktisch validiert bezeichnen.

**Projektstatus:** RB-048 für das spätere Troubleshooting-Training und eine nachfolgende Website-Veröffentlichung vorbereitet – **noch nicht praktisch abgeschlossen**.
