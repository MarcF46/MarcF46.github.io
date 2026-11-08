# RB-006 – Outlook sendet oder empfängt keine E-Mails

> **50 Tickets – 50 typische Supportfälle**  
> **Ticket:** INC-006 · **Support-Level:** L1/L2 · **System:** Windows 11, Outlook, Exchange Online, Microsoft 365  
> **Stand:** 08.11.2026 · **Version:** 1.0  
> **Validierungsstatus:** Anhand offizieller Microsoft-Dokumentation recherchiert. Beispiele und Ticketverlauf sind **fiktiv**; keine praktische Systemvalidierung behauptet.

![RB-006 – Outlook-Support in vier Schritten](assets/rb006_outlook_mailflow_infografik.png)

*Infografik: Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Die Abbildung ist eine didaktische Vereinfachung.*

## 1. Ausgangssituation – Was meldet der Benutzer?

**Fiktives Ticket INC-006:**

> „Ich bekomme heute keine neuen E-Mails. Vor einer Stunde hat mir eine Kollegin etwas geschickt, aber in meinem Outlook ist nichts angekommen. Ob das Senden funktioniert, weiß ich nicht.“

**Beispielumgebung:** Windows-11-Arbeitsplatz `PC-023`, Microsoft-365-Unternehmenskonto `a.meyer@firma.example`, Postfach in **Exchange Online**. Namen und E-Mail-Adressen sind erfunden. `firma.example` ist eine Dokumentationsdomäne und kein tatsächliches Firmenpostfach.

**Ziel:** Einordnen, ob der Fehler beim Outlook-Programm, dessen Verbindung, dem Exchange-Postfach, dem Nachrichtenfluss oder beim empfangenden System liegt; anschließend eine nachvollziehbare, möglichst risikoarme Lösung durchführen und deren Erfolg belegen.

**Leitprinzip:** „Outlook zeigt nichts an“ bedeutet **nicht** automatisch „Die E-Mail wurde nicht zugestellt“.

## 2. Fachbegriffe und Infrastruktur für Einsteiger

| Begriff | Einfach erklärt |
|---|---|
| **Outlook** | E-Mail- und Kalenderanwendung. Ein Programm, nicht automatisch der Server, der Nachrichten zustellt. |
| **Klassisches Outlook** | Desktopprogramm mit lokalen Profilen, COM-Add-Ins und Exchange-Cachemodus (unterstützte Konfigurationen). |
| **Neues Outlook** | Neuere Windows-Anwendung mit anderer Architektur, anderen Einstellungen und eigenen Offlinefunktionen. |
| **Outlook im Web (OWA, früher Outlook Web App)** | Browserzugriff auf ein Exchange-Online-Postfach, etwa unter `https://outlook.office.com/mail/`. |
| **Exchange Online** | Cloudbasierter Microsoft-Dienst zur Verwaltung von Unternehmenspostfächern und E-Mail-Transport. |
| **Microsoft Entra ID** | Cloudbasierter Identitätsdienst für die Anmeldung bei Microsoft 365. |
| **SMTP (Simple Mail Transfer Protocol)** | Protokoll zur Übertragung von E-Mails zwischen Mailservern; nicht gleichbedeutend mit jedem Outlook-Client-Verbindungsweg. |
| **DNS (Domain Name System)** | Übersetzt Namen und hält auch Einträge zur Mailzustellung vor. |
| **MX (Mail Exchanger)** | DNS-Eintrag, der zuständige Empfangs-Mailserver einer Domäne angibt. |
| **HTTPS (Hypertext Transfer Protocol Secure)** | Verschlüsselte Webkommunikation, üblicherweise über TCP-Port 443. |
| **TCP (Transmission Control Protocol)** | Verbindungsorientiertes Transportprotokoll für Netzwerkkommunikation. |
| **NDR (Non-Delivery Report)** | Unzustellbarkeitsmeldung mit Fehlercode, wenn die Zustellung scheitert. |
| **Message Trace** | Nachrichtenablaufverfolgung im Exchange Admin Center: untersucht die Verarbeitung einer konkreten Nachricht. |
| **EAC (Exchange Admin Center)** | Exchange-Verwaltungsoberfläche unter `https://admin.exchange.microsoft.com`. |
| **RBAC (Role-Based Access Control)** | Rollenbasierte Zugriffssteuerung: legt fest, welche Verwaltungsaktionen ein Admin durchführen darf. |
| **MFA (Multi-Factor Authentication)** | Anmeldung mit mehreren Faktoren, etwa Passwort plus Authenticator-Bestätigung. |
| **OST-Datei (Offline Storage Table)** | Lokale synchronisierte Outlook-Datendatei im klassischen Outlook mit Exchange-Cachemodus. |
| **Outbox / Postausgang** | Nachrichten, die lokal oder im Client noch auf ihre Übermittlung warten. |
| **Quarantäne** | Sicherheitsbereich für verdächtige Nachrichten; nicht automatisch freigeben. |

### Wie wandert eine E-Mail durch die Systeme?

```text
Mitarbeiter schreibt eine E-Mail
           |
           v
Outlook-Client (klassisch/neu) oder Outlook im Web
           |
           v
Authentifizierung / Verbindung zum Exchange-Postfach
           |
           v
Exchange Online verarbeitet die Nachricht (Mail Flow)
           |
           +-- Interner Empfänger (gleiche Organisation)
           |      --> Postfach / Filter / Regeln / Anzeige
           |
           +-- Externer Empfänger (andere Organisation)
                  --> Mailtransport / DNS-MX / Ziel-Mailserver
                              --> Annahme / Filter / Zielpostfach
```

**Zwei verschiedene Fragen:**

1. **Kann Outlook mit dem Postfach kommunizieren?** Das betrifft unter anderem Anwendung, Anmeldung und Netzwerk.
2. **Was ist mit einer bestimmten Nachricht passiert?** Das untersucht man serverseitig mit Nachrichtenablaufverfolgung und gegebenenfalls NDR.

Das eine darf nicht mit dem anderen verwechselt werden. Eine Nachricht kann von Exchange angenommen und verarbeitet worden sein, obwohl der Empfänger sie in seinem **Posteingang** nicht sieht.

**Quellen:** [Microsoft – Outlook sendet/empfängt nicht](https://support.microsoft.com/de-de/outlook/i-can-t-send-or-receive-messages-in-outlook) · [Microsoft Learn – Message Trace](https://learn.microsoft.com/de-de/exchange/monitoring/trace-an-email-message/new-message-trace)

## 3. Erste Eingrenzung: Fünf Fragen, die Zeit sparen

Die Erstaufnahme wird im Ticket dokumentiert:

1. **Senden, Empfangen oder beides?** Falls Senden betroffen: Bleibt die Nachricht im Postausgang oder erscheint eine Unzustellbarkeitsmeldung?
2. **Ein Benutzer oder mehrere?** Auch andere Teammitglieder, Standorte oder externe Empfänger?
3. **Welche Outlook-Variante?** Klassisches Outlook, neues Outlook oder Outlook im Web?
4. **Welche konkrete Nachricht?** Absender, Empfänger, ungefährer Zeitpunkt (mit Zeitzone), Betreff nur soweit für die Suche erforderlich; keine unnötigen vertraulichen Inhalte aufnehmen.
5. **Was hat sich geändert?** Passwort, MFA, Netzwerk, VPN, Update, Add-In, Postfachregel, neue Berechtigungen oder Unternehmensrichtlinie?

### Typische Symptome unterscheiden

| Symptom | Plausible Ursache | Erster geeigneter Test |
|---|---|---|
| Klassisches Outlook zeigt „Offline arbeiten“ | Offlinemodus ist aktiv | Statusleiste und Registerkarte **Senden/Empfangen** prüfen |
| Outlook zeigt „Getrennt“ oder „Verbindungsversuch“ | Verbindung/Anmeldung/Clientproblem | Internet, Outlook im Web und Dienststatus vergleichen |
| Nachricht bleibt im Postausgang | Nachricht noch nicht erfolgreich übermittelt | Postausgang, Verbindungsstatus, Anlagegröße, Fehlermeldung prüfen |
| NDR mit `5.x.x`-Code | Zustellungsproblem oder Sicherheitsregel | **Vollständigen** Fehlercode und technischen Abschnitt auswerten |
| Outlook im Web empfängt, Desktop-App nicht | Wahrscheinlich clientbezogen | Synchronisierung, Benutzerprofil, App-Variante, Verbindung prüfen |
| Outlook im Web zeigt Nachricht ebenfalls nicht | Mail Flow, Postfachregel, Spam, Quarantäne oder Serverproblem möglich | Nachricht anhand von Absender/Empfänger/Zeit in Message Trace suchen |
| Mehrere Benutzer betroffen | Dienststörung oder gemeinsame Konfiguration möglich | Microsoft-365-Dienststatus und zentrale Einstellungen prüfen |

**Wichtige Einschränkung:** Ein Symptom ist noch kein Beweis. Auch „Outlook im Web funktioniert“ schließt ein individuelles lokales Problem nicht vollständig aus; es priorisiert die Suche lediglich.

## 4. Zugriffswege: Wo führt der Support die Diagnose durch?

| Situation | Zugriff | Konkretes Vorgehen / Grenze |
|---|---|---|
| Benutzer ist angemeldet | Teams-Bildschirmfreigabe oder freigegebene Fernsteuerung | Outlook-Version, Fehlermeldung, Postausgang und Browser gemeinsam ansehen; Benutzer kann mitarbeiten. |
| Outlook-Desktop funktioniert nicht | Browser am selben oder einem autorisierten Gerät | **Outlook im Web** unter `https://outlook.office.com/mail/` testen, wenn Anmeldung und Unternehmensrichtlinien dies erlauben. |
| Mehrere Benutzer melden die Störung | Microsoft 365 Admin Center | **Integrität → Dienststatus**, insbesondere Exchange Online, prüfen; berechtigter Zugriff erforderlich. |
| Nachricht wird angeblich nicht zugestellt | Exchange Admin Center | **Nachrichtenfluss → Nachrichtenablaufverfolgung**; berechtigte Admin-Rolle erforderlich. |
| Postfach-/Quota-/Transportdiagnose vertiefen | Exchange Online PowerShell auf berechtigtem Admin-PC | `Connect-ExchangeOnline` und reine Lese-Cmdlets; keine direkte RDP-Sitzung auf Microsofts Mailserver erforderlich. |
| Kein Zugang zu Dienstportalen/Client | Telefonisch und autorisierte Eskalation | Exakte Fehlerdaten erfassen, nicht fremde Kennwörter verlangen, zuständige Admins einbeziehen. |

**„Zentral verwalten“** heißt hier: Die IT prüft das Postfach **in einer Verwaltungsoberfläche des Microsoft-365-Dienstes**, ohne sich als der Mitarbeiter in dessen Outlook einzuloggen. Das ist keine GPO (Group Policy Object, Gruppenrichtlinie) und keine direkte interaktive Anmeldung an einem Microsoft-Cloudserver.

### Wer darf was?

Der First-Level-Support kann meist Meldung, Client-Version, Browser-Vergleich und Benutzermaßnahmen prüfen. Wer **Message Trace**, Postfächer, Quarantäne oder Transportregeln verwalten darf, hängt von den **RBAC-Rollen** des Unternehmens ab. Es ist nicht notwendig oder empfehlenswert, pauschal Global-Administratorrechte zu verwenden.

**Quellen:** [Dienststatus im Microsoft 365 Admin Center](https://learn.microsoft.com/de-de/power-platform/admin/check-online-service-health) · [Exchange Admin Center – Nachrichtenablaufverfolgung](https://learn.microsoft.com/de-de/exchange/monitoring/trace-an-email-message/new-message-trace)

## 5. Diagnose-Entscheidungsbaum

![RB-006 – Entscheidungsbaum: Outlook, Postfach oder Mailtransport?](assets/rb006_diagnosebaum.svg)

**Textalternative:**

1. Betroffenheit und genaue Nachricht erfassen; Outlook-Version bestimmen.
2. Dasselbe Postfach in Outlook im Web prüfen.
3. **Nur lokale Anwendung betroffen:** Status, Offline-Modus, Verbindung, Anmeldung, Postausgang und für das klassische Outlook nötigenfalls Profil prüfen.
4. **Auch Web/mehrere Nutzer betroffen:** Microsoft-365-Dienststatus und Exchange-Postfach prüfen.
5. Für eine konkrete Nachricht **Message Trace** ausführen; `Delivered` bedeutet „in der dokumentierten Transportverarbeitung zugestellt“, nicht zwingend „im sichtbaren Posteingang“.
6. Bei `Failed`/`Pending` oder fehlendem Treffer: NDR, Zeitfenster, Absender/Empfänger, Sicherheitsprüfung und Transport untersuchen.
7. Gezielt beheben, mit freigegebenem Testversand prüfen, dokumentieren oder eskalieren.

## 6. L1-Diagnose: Outlook und Internetverbindung

### A – Klassisches Outlook: Offline-Modus kontrollieren

**Ausführungsort:** Outlook des betroffenen Benutzers, während er angemeldet ist.

1. Unten in der Statusleiste auf „Verbunden“, „Getrennt“, „Offline arbeiten“ oder „Verbindungsversuch“ achten.
2. **Senden/Empfangen → Offline arbeiten** prüfen.
3. Ist der Offlinemodus versehentlich eingeschaltet, nach Zustimmung auf Onlinebetrieb zurückschalten.
4. **Senden/Empfangen** ausführen und die ursprüngliche Aktion kontrollieren.

**Achtung:** Die Benutzeroberfläche unterscheidet sich vom **neuen Outlook**. Dessen Offlinefunktion ist unter **Einstellungen → Allgemein → Offline** dokumentiert. Den Schalter aus dem klassischen Outlook nicht blind übertragen.

**Quellen:** [Microsoft Support – Outlook sendet/empfängt nicht](https://support.microsoft.com/de-de/outlook/i-can-t-send-or-receive-messages-in-outlook) · [Offlinearbeit im neuen und klassischen Outlook](https://support.microsoft.com/de-de/outlook/getstarted/how-to-work-offline-in-outlook-for-windows)

### B – Ist der notwendige HTTPS-Zugriff grundsätzlich möglich?

**Ausführungsort:** Betroffener Windows-PC; PowerShell im Benutzerkontext, kein Adminrecht für diese Abfrage erforderlich.

```powershell
# Prüft einen bekannten Outlook-Webendpunkt auf TCP-Port 443.
# -ComputerName = DNS-Name des ausgewählten Testziels.
# -Port 443 = üblicher HTTPS-Port.
Test-NetConnection -ComputerName 'outlook.office.com' -Port 443
```

**Beispielausgabe, fiktiv:**

```text
ComputerName     : outlook.office.com
RemotePort       : 443
TcpTestSucceeded : True
```

**Interpretation:** `True` zeigt, dass zu **diesem** Ziel eine TCP-Verbindung möglich ist. Es beweist **nicht**, dass alle benötigten Microsoft-365-Endpunkte erreichbar, die Anmeldung gültig oder der Exchange-Mailtransport gesund sind. Bei `False` unter anderem Proxy, DNS, Routing, VPN und Firewall anhand der Unternehmenskonfiguration prüfen. Port 443 nicht pauschal für beliebige Ziele öffnen.

```powershell
# Fragt die DNS-Auflösung des angegebenen Hostnamens ab.
# Das Ergebnis gibt IP-Adressen / DNS-Antworten zurück.
Resolve-DnsName -Name 'outlook.office.com'
```

**Hinweis:** Ein erfolgreicher DNS-Test beweist noch nicht, dass sich der Benutzer authentifizieren kann. Beide Befehle sind **Netzwerkdiagnose**, keine Postfachdiagnose.

### C – Browser-Vergleich statt voreiliger Neuinstallation

**Ausführungsort:** Browser des berechtigten Mitarbeiters oder eine ausdrücklich erlaubte Unternehmensumgebung.

1. `https://outlook.office.com/mail/` öffnen.
2. Mit dem **eigenen** Konto des Mitarbeiters anmelden lassen, ohne das Passwort dem Support mitzuteilen.
3. Dieselben Ordner und den gleichen Zeitraum prüfen.
4. Eine geeignete, vorher abgestimmte Testmail vergleichen.

**Ergebnisinterpretation:** Web funktioniert, klassisches Outlook nicht → Desktop-Verbindung, Add-Ins, Offlinezustand, Profil oder Synchronisierung priorisieren. Auch Web betroffen → Nachrichtentransport, Regeln, Postfach und Dienststatus untersuchen.

## 7. Outlook-spezifische Sonderfälle

### A – Postausgang: Versand wurde noch nicht übergeben

Eine Nachricht im **Postausgang** hat den Transport möglicherweise noch nicht erreicht. Erst kontrollieren, ob Internet-/Outlook-Verbindung besteht, ob eine große Anlage oder eine einzelne problematische Nachricht den Versand blockiert und ob eine Fehlermeldung erscheint.

**Nicht:** Nachrichten ungeprüft mehrfach senden. Doppelte Rechnungen oder Kundennachrichten können reale Folgen haben.

### B – Klassisches Outlook: Abgesicherter Modus

Wenn das **klassische** Outlook nicht startet, hängt oder Add-Ins vermutet werden:

**Ausführungsort:** Mit **Windows-Taste + R** den Dialog „Ausführen“ öffnen, dann exakt folgende Zeile eingeben (auch für die Windows-Suche geeignet):

```powershell
# Startet das KLASSISCHE Outlook im abgesicherten Modus.
# Nach outlook.exe folgt ein Leerzeichen vor dem Parameter /safe.
# Add-Ins werden bei diesem Diagnosemodus nicht normal geladen.
outlook.exe /safe
```

Funktioniert Outlook damit, Add-Ins schrittweise und nach Freigabe untersuchen. **Das ist nicht die Standardmaßnahme für das neue Outlook.** Bevor Profile oder lokal synchronisierte Daten verändert werden, Speicher- und Datensicherungsfragen klären (etwa lokale PST-Dateien und nicht synchronisierte Entwürfe).

**Quelle:** [Microsoft Support – Outlook abgesichert starten](https://support.microsoft.com/de-de/office/%C3%B6ffnen-von-outlook-im-abgesicherten-modus-f394c2ee-b2af-e97a-64ee-35cd24414811)

### C – Exchange-Cachemodus und OST-Datei

Das klassische Outlook kann das Exchange-Postfach lokal als **OST-Datei** synchronisieren. Die Inhalte werden vom Server aktualisiert. Das neue Outlook verwendet **nicht** denselben Exchange-Cachemodus. Ein synchronisationsbedingtes Anzeigeproblem ist daher von einem serverseitigen Zustellfehler zu trennen.

**Nicht sofort** OST-Dateien löschen oder ein Benutzerprofil zurücksetzen. Vorher prüfen, ob lokale Änderungen, nicht synchronisierte Elemente oder weitere Datendateien betroffen sein könnten.

**Quelle:** [Microsoft Support – Exchange-Cachemodus](https://support.microsoft.com/de-de/outlook/turn-on-cached-exchange-mode)

## 8. L2-Diagnose: Microsoft-365-Dienststatus und Nachrichtenfluss

### A – Dienststatus prüfen

**Ausführungsort:** `https://admin.microsoft.com` als entsprechend berechtigter Administrator.

1. **Integrität → Dienststatus** öffnen.
2. Exchange Online und gegebenenfalls benachbarte Microsoft-365-Dienste untersuchen.
3. Prüfen, ob eine bekannte Störung zeitlich und geografisch zum Ticket passt.
4. **Kein bekannter Vorfall** heißt nicht automatisch, dass die individuelle Störung ausgeschlossen ist.

**Quelle:** [Microsoft Learn – Online-Dienststatus](https://learn.microsoft.com/de-de/power-platform/admin/check-online-service-health)

### B – Message Trace im Exchange Admin Center

**Ausführungsort:** `https://admin.exchange.microsoft.com` → **Nachrichtenfluss → Nachrichtenablaufverfolgung**.

1. Passenden Zeitraum auswählen (bei Uhrzeiten auf die **Zeitzone** achten).
2. Exakten Absender und Empfänger erfassen.
3. Nachricht suchen; bei mehreren Treffern Zeitpunkt und weitere Metadaten verwenden.
4. Status und Details prüfen: beispielsweise `Delivered`, `Pending`, `Failed` oder spambezogene Ergebnisse.
5. Bei `Delivered` weitere Prüfung des empfangenden Postfachs: **Junk-E-Mail**, **Andere/Relevant**, Regeln, Weiterleitungen, gelöschte Elemente, Quarantäne und Benutzeransicht.
6. Bei `Failed` oder `Pending` das technische Ereignis, eine mögliche NDR-Nachricht und die Zustellstrecke prüfen.
7. Bei **keinem Treffer** prüfen, ob die Nachricht überhaupt an diesen Exchange-Online-Dienst übergeben wurde, ob Sender/Empfänger/Zeitfenster korrekt sind oder ob ein vorgelagerter Mailgateway beteiligt ist.

**Achtung:** Message Trace sieht nur Nachrichten, die der betreffende Exchange-Online-Dienst im dokumentierten Geltungsbereich verarbeitet. Es ersetzt **nicht** eine vollständige End-to-End-Prüfung fremder Mailserver. `Delivered` allein beweist weder das Lesen noch den sichtbaren Eingang in einer bestimmten Outlook-Ansicht.

**Quelle:** [Microsoft Learn – Nachrichtenablaufverfolgung](https://learn.microsoft.com/de-de/exchange/monitoring/trace-an-email-message/new-message-trace)

### C – NDR und SMTP-Fehler korrekt verstehen

**NDR (Non-Delivery Report)** bedeutet **Unzustellbarkeitsbericht**. Er nennt meist einen Fehlercode und oft technische Informationen zu beteiligten Mailservern.

| Codegruppe / Beispiel | Typische Bedeutung | Diagnoseentscheidung |
|---|---|---|
| `4.x.x` | Häufig vorübergehendes Zustellproblem | Verzögerung, erneuter Zustellversuch, Infrastrukturstatus prüfen |
| `5.x.x` | Häufig dauerhafter Fehler der Zustellung | Exakten vollständigen Code und Beschreibung auswerten |
| `5.1.1` | Häufig unbekannte/ungültige Empfängeradresse | Adresse und Zielsystem prüfen |
| `5.2.2` | Kann mit vollem Postfach zusammenhängen | Exakte NDR-Details und Quotas kontrollieren |
| `5.7.1` | Häufig Sicherheits- oder Richtlinienablehnung | Richtlinien, Authentifizierung und Empfängersystem prüfen |

**Keine pauschalen Schlüsse aus einzelnen Codeziffern:** Der genaue erweiterte Code samt Text des empfangenden Systems ist entscheidend. Nicht einfach Anti-Spam-Schutz deaktivieren.

**Quelle:** [Microsoft Learn – NDR und SMTP-Fehler](https://learn.microsoft.com/de-de/troubleshoot/exchange/email-delivery/ndr/non-delivery-reports-in-exchange-online)

## 9. L2-Diagnose mit Exchange Online PowerShell (lesend)

**Ausführungsort:** Berechtigter Administrations-PC, installierter und freigegebener PowerShell-Modulstand `ExchangeOnlineManagement`, Netzwerkzugriff und geeignete Exchange-Online-Rolle. **Nicht** im Namen des betroffenen Benutzers und **nicht** auf einem Microsoft-Cloudserver per RDP ausführen.

### A – Verbindung herstellen

```powershell
# Importiert das bereits installierte Exchange-Online-Verwaltungsmodul.
# Wenn es nicht installiert ist: IT-interne Installationsrichtlinie beachten.
Import-Module ExchangeOnlineManagement

# Öffnet die Exchange-Online-Administrationsverbindung.
# -UserPrincipalName benennt das EIGENE berechtigte Administratorkonto.
# Die Anmeldeaufforderung kann MFA benötigen.
Connect-ExchangeOnline -UserPrincipalName 'it.admin@firma.example'
```

**Hinweis:** Die Beispieladresse muss durch ein autorisiertes echtes Administratorkonto ersetzt werden. Ein erfolgreicher Verbindungsaufbau erteilt nicht automatisch alle Verwaltungsrechte; RBAC legt den Umfang fest.

### B – Nachrichtenverlauf abfragen

```powershell
# Speichert den gewünschten Absender (hier ein fiktives Beispiel).
$absender = 'a.meyer@firma.example'

# Legt den Beginn eines kurzen Abfragefensters fest.
# -Date holt das aktuelle Datum; AddHours(-24) geht 24 Stunden zurück.
$start = (Get-Date).AddHours(-24)

# Speichert den Zeitpunkt des Abfrageendes.
$ende = Get-Date

# Fragt serverseitige Exchange-Online-Nachrichtendaten ab.
# -SenderAddress filtert nach dem Absender.
# -StartDate und -EndDate begrenzen den Zeitraum.
# -ResultSize begrenzt die maximalen Treffer.
# Select-Object begrenzt die Ausgabe auf vier relevante Spalten.
Get-MessageTraceV2 -SenderAddress $absender -StartDate $start -EndDate $ende -ResultSize 100 |
    Select-Object Received, SenderAddress, RecipientAddress, Status
```

**Interpretation:** Ein passender Treffer kann nachweisen, dass Exchange Online die Nachricht im eigenen Verarbeitungspfad erfasst hat. Der Status muss mit den zugehörigen Details interpretiert werden. Ein fehlender Treffer kann auch auf ein falsches Zeitfenster, den falschen Mandanten oder eine Übermittlung außerhalb dieses Pfads hinweisen.

**Stand 2026:** Microsoft dokumentiert für `Get-MessageTraceV2` ein Suchfenster bis **90 Tage rückwirkend**, jedoch **höchstens zehn Tage pro einzelner Abfrage**. Zeitstempel der Ausgabe können als UTC (Coordinated Universal Time) erscheinen. Die Abfrage ist hier bewusst auf 24 Stunden beschränkt.

**Quelle:** [Microsoft Learn – Get-MessageTraceV2](https://learn.microsoft.com/de-de/powershell/module/exchangepowershell/get-messagetracev2)

### C – Postfachstatistik prüfen

```powershell
# Speichert die zu untersuchende Postfachadresse.
$postfach = 'a.meyer@firma.example'

# Fragt die Exchange-Online-Postfachstatistik ab.
# -Identity bezeichnet das Postfach.
# Select-Object begrenzt die Ausgabe auf Name, Größe und Elementanzahl.
Get-EXOMailboxStatistics -Identity $postfach |
    Select-Object DisplayName, TotalItemSize, ItemCount
```

**Interpretation:** Eine große Postfachgröße allein beweist noch nicht, dass ein konkretes Speicherlimit überschritten wurde. Dazu müssen die **tatsächlich geltenden Postfachquotas** und etwaige NDR-Informationen geprüft werden.

**Quelle:** [Microsoft Learn – Get-EXOMailboxStatistics](https://learn.microsoft.com/de-de/powershell/module/exchangepowershell/get-exomailboxstatistics)

### D – Sitzung schließen

```powershell
# Beendet die Exchange-Online-PowerShell-Verbindung.
Disconnect-ExchangeOnline -Confirm:$false
```

**Quellen:** [Microsoft Learn – Verbindung zu Exchange Online PowerShell](https://learn.microsoft.com/de-de/powershell/exchange/connect-to-exchange-online-powershell) · [Get-MessageTraceV2](https://learn.microsoft.com/de-de/powershell/module/exchangepowershell/get-messagetracev2)

## 10. Sicherheits- und Zustellmechanismen (Einsteigerüberblick)

Es kann vorkommen, dass eine Nachricht nicht ankommt, obwohl Outlook problemlos läuft. Dann können weitere Systeme beteiligt sein:

| Technik / Funktion | Wozu dient sie? | Beispiel für ein Problem |
|---|---|---|
| **MX (Mail Exchanger)** | Legt über DNS fest, wo E-Mails einer Domäne empfangen werden sollen. | Falscher MX-Eintrag leitet externe Nachrichten falsch. |
| **SPF (Sender Policy Framework)** | Beschreibt autorisierte Versandserver einer Domäne. | Empfänger bewertet die absendende Quelle als nicht autorisiert. |
| **DKIM (DomainKeys Identified Mail)** | Versieht Nachrichten mit einer kryptografischen Signatur. | Signatur fehlt oder scheitert nach Veränderung der Nachricht. |
| **DMARC (Domain-based Message Authentication, Reporting and Conformance)** | Legt Ausrichtungs-/Prüfregeln auf Basis von SPF und/oder DKIM fest. | Nachricht wird gemäß Empfängerrichtlinie zurückgewiesen oder quarantänisiert. |
| **Transportregel** | Organisatorische Regel zur Bearbeitung von Nachrichten im Mailtransport. | Nachricht wird umgeleitet oder blockiert. |
| **Quarantäne** | Sicherheitsbereich für potenziell gefährliche E-Mails. | Nutzer sieht Nachricht nicht im normalen Posteingang. |
| **Posteingangsregel** | Benutzerdefinierte automatische Ablage oder Weiterleitung. | Mail wurde automatisch in einen anderen Ordner verschoben. |

**Wichtige Differenzierung:** **DNS-MX** betrifft die Zustellung zwischen Mailservern. Es erklärt nicht automatisch, warum das klassische Outlook gerade „Offline arbeiten“ anzeigt. SPF/DKIM/DMARC gehören ebenfalls in einen **Mail-Flow-Diagnosezweig**, nicht als erste Maßnahme bei einem einzelnen nicht synchronisierenden Outlook-Client.

**Quelle:** [Microsoft Learn – E-Mail-Authentifizierung diagnostizieren](https://learn.microsoft.com/defender-office-365/email-authentication-troubleshoot)

## 11. Befund → gezielte Lösung und Risiken

| Nachgewiesener / eingegrenzter Befund | Gezieltes Vorgehen | Was nicht blind getan werden sollte |
|---|---|---|
| Klassisches Outlook manuell offline | Offline-Modus ausschalten, Verbindung prüfen, Senden/Empfangen testen | Nicht sofort Profil löschen |
| Nur Desktop betroffen, Web funktioniert | Clientkonfiguration, Anmeldestatus, Add-Ins, ggf. Profil/Cache nach Sicherungsprüfung | Keine globalen Exchange-Regeln ändern |
| Fehlende Netzwerkverbindung | DNS, Proxy, VPN, Routing, Firewall anhand IT-Vorgaben prüfen | Sicherheitsfilter nicht pauschal deaktivieren |
| Mail im Postausgang blockiert | Fehlermeldung, Anlagegröße, Verbindung und Status untersuchen | Nicht mehrfach unkontrolliert versenden |
| Message Trace `Delivered`, Mail nicht sichtbar | Junk, Regeln, Andere/Relevant, Gelöscht, Ordner und Ansicht prüfen | Nicht ungeprüft behaupten, Nachricht wurde gelesen |
| Message Trace `Failed` und NDR | Vollständigen NDR-Fehlercode und beteiligten Server untersuchen | Nicht pauschal Spamregeln abschalten |
| Verdacht auf Quarantäne | Quarantäne mit berechtigter Rolle prüfen, Sicherheitsbewertung durchführen | Verdächtige Nachrichten nicht ungeprüft freigeben |
| Postfachlimit erreicht | Tatsächliche Quota und betroffene Daten prüfen; freigegebene Archiv-/Speichermaßnahme | Nachrichten nicht willkürlich löschen |
| Dienststörung für mehrere Benutzer | Dienststatus dokumentieren, Kommunikation und Eskalation | Keine Einzelgeräte massenhaft neu konfigurieren |

## 12. Erfolgskontrolle – Was heißt „wieder funktionsfähig“?

- [ ] Mit dem **betroffenen Benutzer** ist die richtige Outlook-Variante festgehalten.
- [ ] Eine abgestimmte, inhaltlich unkritische Test-E-Mail wurde genau **einmal** versendet.
- [ ] Der Empfänger hat sie tatsächlich im vorgesehenen Postfach gefunden; gegebenenfalls Mail-Flow-Status dokumentiert.
- [ ] Eine eingehende Testnachricht erscheint auf dem ursprünglich betroffenen Client; Synchronisierung geprüft.
- [ ] Postausgang enthält keine ungeklärten Nachrichten aus dem Fehlerzeitraum.
- [ ] Keine unnötigen Sicherheits- oder Transportregeln verändert.
- [ ] Ursache, ermittelte Belege, Maßnahmen, Ergebnis und gegebenenfalls Eskalation dokumentiert.

**Achtung:** Eine einmalige erfolgreiche Testmail beweist nicht, dass **sämtliche** externen Empfängerdomänen oder alle Mail-Flow-Szenarien funktionieren. Testumfang an der Störung ausrichten.

## 13. Eskalation von L1 an L2 und weitere Spezialisten

**L1:** Ticket aufnehmen, Outlook-Variante bestimmen, Netzwerk/Offline-Modus, Postausgang und Web-Vergleich prüfen; einfache genehmigte Maßnahmen durchführen und Ergebnisse dokumentieren.

**L2 / Exchange-Administration:** Message Trace, NDR-Analyse, Postfachstatistik, Sicherheitsrichtlinien, Quarantäne, Transportregeln, Empfängersysteme und Microsoft-365-Störungen untersuchen.

**Eskalation besonders bei:** Mehreren betroffenen Benutzern; abgewiesenen externen E-Mails; ungeklärten NDR-Codes; ungewöhnlichen Anmelde- und Sicherheitshinweisen; Quarantäne; möglicher Datenexfiltration; unklaren Tenant- oder Hybrid-Mailrouting-Konfigurationen.

**Mindestens im Eskalationsticket:** Betroffener Benutzer, Outlook-Version, Zeit und Zeitzone, Absender/Empfänger, anonymisierter Fehlercode, bereits durchgeführte Tests, Outlook-im-Web-Ergebnis und gegebenenfalls Message-Trace-Status. Persönliche Inhalte und Zugangsdaten weglassen.

## 14. Muster-Ticket INC-006 – Fiktiver Abschluss

> **Fehlerbild:** Mitarbeiter erhält im klassischen Outlook keine neuen E-Mails; eine Testmail ist in Outlook im Web sichtbar.  
> **Diagnose:** Betroffen war nur der Outlook-Desktop auf `PC-023`. Browserzugriff auf dasselbe Exchange-Online-Postfach funktionierte. Das klassische Outlook zeigte „Offline arbeiten“ in der Statusleiste.  
> **Ursache:** Offlinemodus im klassischen Outlook war aktiviert.  
> **Maßnahme:** Nach Rücksprache Offlinemodus deaktiviert und Synchronisierung angestoßen.  
> **Erfolgskontrolle:** Zuvor fehlende Testmail wird im Outlook-Client angezeigt; Versand einer abgestimmten Testmail erfolgreich.  
> **Status:** Gelöst.  
> **Hinweis:** Didaktisches Beispiel; nicht real durchgeführt.

## 15. Lernkontrolle, Transferaufgabe und Quellen

### Verständnisfragen (nicht nur auswendig lernen)

1. Warum ist Outlook **nicht** gleich Exchange Online?
2. Warum ist ein erfolgreicher TCP-Test auf Port 443 **kein** Nachweis für erfolgreichen E-Mail-Versand?
3. Welche Schlussfolgerung ziehst du daraus, dass eine Nachricht **in Outlook im Web** erscheint, im klassischen Outlook aber fehlt?
4. Was bedeutet Message Trace `Delivered` – und was bedeutet es **nicht**?
5. Wann hat ein NDR eine höhere Aussagekraft als das Löschen einer OST-Datei?

### Neue Diagnoseaufgabe ohne Lösungsvorgabe

> Drei Mitarbeiter empfangen interne E-Mails problemlos. E-Mails an einen bestimmten externen Geschäftspartner liefern jedoch einen NDR `550 5.7.1`. Outlook im Web zeigt bei allen Mitarbeitern normale Funktion, und der Microsoft-365-Dienststatus meldet keinen passenden Vorfall. Welche **zwei ersten zentralen Prüfungen** sind sinnvoll und warum?

### Quellen (Auswahl; direkt beim jeweiligen Verfahren verlinkt)

1. [Microsoft Support – Ich kann in Outlook keine Nachrichten senden oder empfangen](https://support.microsoft.com/de-de/outlook/i-can-t-send-or-receive-messages-in-outlook)
2. [Microsoft Support – Offlinearbeit in Outlook für Windows](https://support.microsoft.com/de-de/outlook/getstarted/how-to-work-offline-in-outlook-for-windows)
3. [Microsoft Support – Exchange-Cachemodus](https://support.microsoft.com/de-de/outlook/turn-on-cached-exchange-mode)
4. [Microsoft Learn – Nachrichtenablaufverfolgung in Exchange Online](https://learn.microsoft.com/de-de/exchange/monitoring/trace-an-email-message/new-message-trace)
5. [Microsoft Learn – Get-MessageTraceV2](https://learn.microsoft.com/de-de/powershell/module/exchangepowershell/get-messagetracev2)
6. [Microsoft Learn – NDR- und SMTP-Fehlercodes](https://learn.microsoft.com/de-de/troubleshoot/exchange/email-delivery/ndr/non-delivery-reports-in-exchange-online)
7. [Microsoft Learn – Exchange Online PowerShell verbinden](https://learn.microsoft.com/de-de/powershell/exchange/connect-to-exchange-online-powershell)
8. [Microsoft Learn – Get-EXOMailboxStatistics](https://learn.microsoft.com/de-de/powershell/module/exchangepowershell/get-exomailboxstatistics)
9. [Microsoft Learn – Dienststatus prüfen](https://learn.microsoft.com/de-de/power-platform/admin/check-online-service-health)
10. [Microsoft Learn – E-Mail-Authentifizierung diagnostizieren](https://learn.microsoft.com/defender-office-365/email-authentication-troubleshoot)

**Projektregel:** Keine realen Postfachinhalte, personenbezogenen Mailadressen, Tokens oder Zugangsdaten veröffentlichen. Praktisch durchgeführte Tests erst nach tatsächlicher Durchführung als „validiert“ kennzeichnen.
