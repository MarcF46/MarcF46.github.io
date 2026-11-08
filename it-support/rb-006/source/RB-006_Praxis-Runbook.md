# RB-006 – Praxis-Runbook: Outlook sendet oder empfängt nicht

**Zweck:** Kompakte, wiederverwendbare L1/L2-Arbeitsanweisung  
**Version:** 1.0 · **Stand:** 08.11.2026 · **Status:** Recherchiert, nicht praktisch validiert  
**Geltungsbereich:** Microsoft-365-Unternehmensumgebung mit Exchange Online; bei lokalem Exchange können Abläufe und Befehle abweichen.

## 1. Ticket aufnehmen (L1)

- [ ] **Was genau?** Senden, Empfangen oder beides; Postausgang oder NDR?
- [ ] **Wer betroffen?** Eine Person oder mehrere; nur bestimmte Empfänger?
- [ ] **Outlook-Version?** Klassisch, neu oder Web; Windows-PC/Standort notieren.
- [ ] **Konkretes Beispiel?** Absender, Empfänger, Zeitpunkt und Zeitzone; keine vertraulichen Nachrichteninhalte kopieren.
- [ ] **Änderungen?** Passwort/MFA, VPN, Netzwerk, Update, Profil, neue Regeln.
- [ ] **Berechtigter Supportweg?** Bildschirmfreigabe, eigene Adminoberfläche oder Eskalation.

## 2. Entscheidung: App- oder Serverproblem? (L1)

| Prüfung | Ergebnis und nächster Schritt |
|---|---|
| `https://outlook.office.com/mail/` mit **dem eigenen Benutzerkonto** öffnen | **Web funktioniert, Desktop nicht:** Clientdiagnose. **Auch Web betroffen:** Postfach/Dienst/Mail Flow prüfen. |
| Mehrere Kollegen mit gleicher Störung? | Microsoft-365-Dienststatus prüfen lassen; zentralen Vorfall priorisieren. |
| Fehlermeldung oder NDR vorhanden? | Vollständigen Code, Zeit, Absender/Empfänger dokumentieren; ggf. L2. |

## 3. Clientdiagnose (L1)

**Klassisches Outlook:**

- [ ] Statusleiste prüfen: **Verbunden / Getrennt / Verbindungsversuch / Offline arbeiten**.
- [ ] Ggf. **Senden/Empfangen → Offline arbeiten** auf Online zurückstellen.
- [ ] **Postausgang** auf hängengebliebene Nachrichten untersuchen, dabei nichts mehrfach ungeprüft senden.
- [ ] Bei vermutetem Add-In-/Startfehler nach Freigabe **Windows+R** öffnen und `outlook.exe /safe` eingeben (**nur klassisches Outlook**).

**Neues Outlook:**

- [ ] Neue Outlook-Variante dokumentieren; Offlineverhalten unter **Einstellungen → Allgemein → Offline** prüfen.
- [ ] Keine klassischen Profil-/OST- oder Add-In-Maßnahmen blind übertragen.

**Client-Netzwerk** – PowerShell am betroffenen PC:

```powershell
# Testet TCP-Port 443 zu EINEM Outlook-Webendpunkt.
# Ein positives Ergebnis beweist NICHT, dass Microsoft 365 fehlerfrei ist.
Test-NetConnection -ComputerName 'outlook.office.com' -Port 443

# Prüft die Namensauflösung für denselben Testhost.
Resolve-DnsName -Name 'outlook.office.com'
```

`TcpTestSucceeded = False`: DNS, Proxy, VPN, Firewall, Routing, Netzwerk prüfen.  
`TcpTestSucceeded = True`: Nur dieser TCP-Test war erfolgreich – App-Anmeldung, Endpunkte und Zustellung weiterhin offen.

## 4. Zentraldiagnose (L2 / berechtigte Administratoren)

**A – Dienststatus:** Microsoft 365 Admin Center `https://admin.microsoft.com` → **Integrität → Dienststatus** → Exchange Online.

**B – Nachrichtenablaufverfolgung:** Exchange Admin Center `https://admin.exchange.microsoft.com` → **Nachrichtenfluss → Nachrichtenablaufverfolgung**.

- [ ] Nachricht nach **Absender, Empfänger, Zeitfenster** suchen.
- [ ] `Delivered`: Mailtransport hat eine Zustellung registriert; Ordner, Junk, Regeln, Ansicht und ggf. Quarantäne prüfen.
- [ ] `Failed` / `Pending`: Detailereignisse und NDR auswerten; bei externem Ziel Transport/Empfänger prüfen.
- [ ] **Kein Treffer:** Filter, Zeitpunkt, falschen Mandanten, vorgelagerte Gateways und tatsächliche Einlieferung prüfen.

**C – PowerShell bei vorliegenden Rechten** – auf dem **Administrationsrechner**:

```powershell
# Bereits installiertes Modul für Exchange Online laden.
Import-Module ExchangeOnlineManagement

# Mit dem EIGENEN berechtigten Admin-Konto anmelden.
# Die Anmeldung kann im Browser und mit MFA erfolgen.
Connect-ExchangeOnline -UserPrincipalName 'it.admin@firma.example'

# Start des kurzen Suchfensters: letzte 24 Stunden.
$start = (Get-Date).AddHours(-24)

# Ende des Suchfensters: jetzt.
$ende = Get-Date

# Nachrichtendaten für den Beispiel-Absender auswerten.
# Zeitstempel der Ergebnisdaten können in UTC erscheinen.
Get-MessageTraceV2 -SenderAddress 'a.meyer@firma.example' -StartDate $start -EndDate $ende -ResultSize 100 |
    Select-Object Received, SenderAddress, RecipientAddress, Status

# Postfachgröße und Elementanzahl lesend prüfen.
# Große Größe ist NICHT gleichbedeutend mit überschrittener Quota.
Get-EXOMailboxStatistics -Identity 'a.meyer@firma.example' |
    Select-Object DisplayName, TotalItemSize, ItemCount

# Administrationssitzung nach Abschluss sauber beenden.
Disconnect-ExchangeOnline -Confirm:$false
```

**Achtung:** Die E-Mail-Adressen sind Beispielwerte. Cmdlets erfordern zulässige Berechtigungen; bei fehlenden Rollen nicht versuchen, Rechte zu umgehen. `Get-MessageTraceV2` dient der **Serverabfrage**, nicht dem Abruf des Outlook-Client-Postausgangs.

## 5. Befund → gezielte Maßnahme

| Befund | Maßnahme |
|---|---|
| Klassisches Outlook versehentlich offline | Online-Modus aktivieren, Synchronisierung erneut prüfen. |
| Web funktioniert, lokale App nicht | Client-/Profil-/Anmeldestatus untersuchen, OST/Profile nur nach Sicherungs- und Folgenprüfung bearbeiten. |
| Mehrere Postfächer betroffen, Dienstvorfall | Vorfall dokumentieren, Nutzer informieren, zentral eskalieren. |
| Message Trace `Delivered`, im Posteingang „fehlt“ | Junk, Andere/Relevant, Regeln, verschobene/gelöschte Nachrichten, Quarantäne prüfen. |
| NDR `5.x.x` | Exakten Code und beteiligten Server lesen; Regel oder Empfängerfehler gezielt untersuchen. |
| Postfachspeicher verdächtig | **Quota** und Statistik vergleichen; keine willkürlichen Löschungen. |
| Nachricht in Quarantäne | Mit Sicherheitsteam prüfen; nicht ungeprüft freigeben. |
| Versand nur zu einer Fremddomäne scheitert | MX, Zielserver, Transport und SPF/DKIM/DMARC *abhängig vom NDR* untersuchen. |

**Nicht blind:** Outlook neu installieren, OST löschen, Profile neu anlegen, Sicherheitsrichtlinien abschalten, Quarantäne freigeben oder E-Mails mehrfach senden.

## 6. Erfolgskontrolle

- [ ] Ursache anhand von Befund und Maßnahme plausibel belegt.
- [ ] Freigegebener **Testempfang** funktioniert auf ursprünglich betroffenem Client.
- [ ] Freigegebener **Testversand** wird vom gewünschten Empfänger bestätigt.
- [ ] Postausgang geprüft, keine ungeklärten Nachrichten mehrfach verschickt.
- [ ] Relevante Trace-/NDR-Befunde festgehalten (ohne sensible Inhalte).
- [ ] Ticket mit Uhrzeit, betroffenen Systemen, Maßnahme und Testergebnis geschlossen oder begründet eskaliert.

## 7. Muster-Ticketabschluss (fiktiv)

> **INC-006:** Benutzer meldete fehlende E-Mails im klassischen Outlook. In Outlook im Web war dieselbe Testnachricht vorhanden; keine zusätzliche Dienststörung festgestellt. Klassisches Outlook zeigte „Offline arbeiten“. Online-Modus nach Rücksprache aktiviert und Synchronisierung erneut geprüft. Testmail am Client sichtbar; Versand einer vereinbarten Testnachricht erfolgreich. **Status: gelöst.**

## 8. Technische Quellen

- [Microsoft Support: Outlook sendet/empfängt nicht](https://support.microsoft.com/de-de/outlook/i-can-t-send-or-receive-messages-in-outlook)
- [Microsoft Support: Offlinearbeit in Outlook](https://support.microsoft.com/de-de/outlook/getstarted/how-to-work-offline-in-outlook-for-windows)
- [Microsoft Learn: Nachrichtenablaufverfolgung](https://learn.microsoft.com/de-de/exchange/monitoring/trace-an-email-message/new-message-trace)
- [Microsoft Learn: Get-MessageTraceV2](https://learn.microsoft.com/de-de/powershell/module/exchangepowershell/get-messagetracev2)
- [Microsoft Learn: Exchange Online PowerShell](https://learn.microsoft.com/de-de/powershell/exchange/connect-to-exchange-online-powershell)
- [Microsoft Learn: NDRs/SMTP-Fehlercodes](https://learn.microsoft.com/de-de/troubleshoot/exchange/email-delivery/ndr/non-delivery-reports-in-exchange-online)

**Lernartikel:** [RB-006 – Ausführliche Grundlagen und Diagnose](RB-006_Lernartikel.md)
