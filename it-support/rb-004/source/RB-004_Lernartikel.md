# RB-004 – Anwendung startet nicht oder stürzt ab

> **50 Tickets – 50 typische Supportfälle**  
> **Ticket:** INC-004 · **Support-Level:** L1/L2 · **System:** Windows 11 · **Stand:** 07.11.2026 · **Version:** 1.0  
> **Validierungsstatus:** Recherchiert und als fiktives Fallbeispiel ausgearbeitet; noch nicht praktisch getestet.

![Infografik RB-004: Anwendungsfehler systematisch bearbeiten](assets/rb004_anwendungsfehler_infografik.png)

## 1. Ausgangssituation und Ziel

**Fiktives Ticket INC-004:**

> „Unser Inventarprogramm öffnet sich seit heute Morgen kurz und verschwindet sofort. Gestern funktionierte es noch. Ich muss dringend Geräte erfassen.“

**Ziel:** Herausfinden, ob die Anwendung überhaupt startet, abstürzt oder nicht reagiert; den Fehler auf Anwendung, Benutzerprofil, Gerät, Dienst oder Netzabhängigkeit eingrenzen; geeignete und sichere Schritte durchführen; das Ergebnis mit Belegen dokumentieren.

**Leitgedanke:** Nicht sofort neu installieren. Zuerst den Zeitpunkt des Fehlers, die betroffenen Personen und technische Befunde sichern.

## 2. Grundlagen und Begriffe

| Begriff | Anfängerfreundliche Bedeutung |
|---|---|
| **Anwendung (App)** | Programm, das ein Benutzer für eine bestimmte Aufgabe startet. |
| **Prozess** | Laufende Instanz eines Programms. Ein Programm kann mehrere Prozesse starten. |
| **PID (Process Identifier)** | Eindeutige Nummer eines laufenden Prozesses, solange er existiert. |
| **Dienst (Service)** | Hintergrundkomponente, die ohne geöffnetes Programmfenster arbeiten kann; nicht jede Anwendung nutzt Windows-Dienste. |
| **EXE (Executable)** | Ausführbare Windows-Programmdatei, zum Beispiel `InventarClient.exe`. |
| **DLL (Dynamic Link Library)** | Programmbibliothek, die durch eine Anwendung oder Windows geladen werden kann. |
| **WER (Windows Error Reporting)** | Windows-Fehlerberichterstattung; kann Informationen über Programmabstürze erfassen. |
| **Ereignisanzeige** | Windows-Werkzeug für System-, Anwendungs- und Sicherheitsprotokolle. |
| **Zuverlässigkeitsverlauf** | Chronologische Übersicht über Softwarefehler und weitere Stabilitätsereignisse. |
| **Absturz (Crash)** | Ein Prozess wird wegen eines Fehlers unerwartet beendet. |
| **Hänger (Hang)** | Ein Prozess läuft möglicherweise weiter, reagiert aber nicht oder nur sehr langsam. |
| **Add-in / Plug-in** | Erweiterung, die zusätzliche Funktionen einbindet und selbst Fehler verursachen kann. |
| **Runtime / Laufzeitumgebung** | Softwarekomponente, die eine Anwendung zur Ausführung benötigt, beispielsweise eine bestimmte .NET-Laufzeit. |
| **L1 / L2** | First-Level-Support: Erstaufnahme und Standardmaßnahmen; Second-Level-Support: vertiefte Analyse und komplexere Fehlerbehebung. |

### Drei Fehlerbilder – drei unterschiedliche Diagnosen

| Benutzer meldet | Technische Frage | Mögliche Spur |
|---|---|---|
| **„Startet gar nicht“** | Erscheint ein Prozess? Wird er sofort beendet? | Blockierte Ausführung, fehlende Datei, Lizenz, defekte Konfiguration oder Absturz beim Start. |
| **„Stürzt nach einigen Sekunden ab“** | Wann endet der Prozess, gibt es Ereignis 1000? | Fehlermodul, Programmfehler, Erweiterung oder Abhängigkeit. |
| **„Fenster ist eingefroren“** | Läuft der Prozess weiter? | Wartet auf Netzwerk, hängt in einer Berechnung, UI reagiert nicht. |

**Wichtig:** Die drei Aussagen sind keine fertigen Diagnosen. Beispielsweise kann eine „nicht startende“ Anwendung intern sehr wohl kurz einen Prozess erzeugen und sofort abstürzen.

## 3. Fehleraufnahme und Eingrenzung

Zuerst mit dem Mitarbeiter klären:

1. **Welche Anwendung und Version?** Name, Hersteller, genaue Fehlermeldung; ggf. Screenshot ohne sensible Daten.
2. **Wann trat es erstmals auf?** Seit Update, Passwortwechsel, Gerätewechsel oder Netzwechsel?
3. **Wer ist betroffen?** Nur dieser Benutzer, alle Benutzer auf diesem Gerät oder mehrere Geräte?
4. **Was passiert genau?** Kein Fenster, kurzes Fenster und Absturz, Fehlermeldung oder Hänger?
5. **Welche Arbeiten gehen verloren?** Ungespeicherte Daten, betroffener Geschäftsprozess, Priorität.
6. **Kann man den Fehler reproduzieren?** Nur soweit dies ohne Datenverlust oder weitere Störung sicher ist.

**Beispiel:** Ist nur ein Benutzer betroffen, kommt dessen Profil, Konto oder individuelle App-Konfiguration in Betracht. Sind alle Benutzer auf einem PC betroffen, untersuchen wir stärker die Installation und lokale Abhängigkeiten. Betrifft es viele PCs gleichzeitig, prüfen wir gemeinsame Dienste, Updates und Netzressourcen.

## 4. Diagnosezugriff: Wie kommt der Support an Informationen?

| Situation | Zugriffsweg | Konkret machbar |
|---|---|---|
| Mitarbeiter ist angemeldet und kann das Problem zeigen | Teams-Screen-Sharing, Windows-Schnellhilfe oder freigegebene Fernsteuerung | Fehler gemeinsam reproduzieren, Einstellungen ansehen, Benutzer anleiten. |
| PC erreichbar, technische Diagnose erforderlich | RDP (*Remote Desktop Protocol*) mit eigenem berechtigtem Konto | Eigene grafische Windows-Sitzung öffnen; **keine gemeinsame Bildschirmfreigabe**. |
| PC erreichbar, kein grafischer Desktop nötig | WinRM (*Windows Remote Management*) / PowerShell-Remoting, sofern eingerichtet | Prozess- und Ereignisinformationen remote abfragen. |
| Mehrere Geräte betroffen | Zentrale IT-Verwaltung und Hersteller-Statusinformationen | Installationsstand, Ausrollung, Ereignisse und zentralen Dienst prüfen. |
| PC nicht remote erreichbar | Telefonischer Support oder Vor-Ort-Diagnose | Anwender anleiten oder am Gerät prüfen. |

**Achtung:** Verwendete Zugangsmethoden müssen durch die IT-Abteilung freigegeben sein. RDP kann eine vorhandene lokale Sitzung sperren oder trennen und ist nicht mit gemeinsamer Maussteuerung identisch.

## 5. Diagnose-Entscheidungsbaum

![Entscheidungsbaum: Anwendungsfehler eingrenzen](assets/rb004_diagnosebaum.svg)

**Textalternative:**

1. **Sind mehrere Benutzer oder Geräte betroffen?** Ja → gemeinsame Server-, Lizenz-, Netzwerk-, Update- oder Rollout-Probleme prüfen. Nein → Client/Benutzer prüfen.
2. **Läuft ein Prozess?** Nein → Startblockade, Programmdatei, Berechtigungen, Installation und Ereignisse prüfen. Ja → weiter.
3. **Wird er unerwartet beendet?** Ja → Absturzereignisse und Fehlermodule untersuchen. Nein, aber Fenster reagiert nicht → Hänger, Ressourcen und Abhängigkeiten prüfen.
4. **Nur ein Benutzer betroffen?** Dann Profil-/Benutzereinstellungen prüfen. **Alle Benutzer auf demselben Gerät?** Dann systemweite Installation und Abhängigkeiten prüfen.
5. **Befund ausreichend?** Gezielte Maßnahme auswählen; sonst Befunde an L2/Hersteller eskalieren.

## 6. Diagnosewerkzeuge ohne PowerShell

### A – Windows-Ereignisanzeige

**Ausführungsort:** Betroffener PC oder berechtigte Remoteverwaltung.

1. `Win + R` drücken.
2. `eventvwr.msc` eingeben und bestätigen.
3. Zu **Windows-Protokolle → Anwendung** wechseln.
4. Ereignisse zum **genauen Fehlerzeitpunkt** untersuchen.
5. Interessante Quellen: **Application Error** (häufig Ereignis-ID **1000**) und **Windows Error Reporting** (häufig **1001**).
6. Betroffene Anwendung, Modul, Zeitpunkt und Ausnahme-/Fehlercode notieren. Die konkrete Darstellung variiert.

**Wichtig:** Die Ereignis-ID **1000** im Anwendungsprotokoll ist ein typischer Hinweis auf einen Absturz. **1001** ist allein nicht eindeutig; die **Quelle** und der Ereignisinhalt sind entscheidend. Nicht jeder Startfehler erzeugt diese Ereignisse.

### B – Zuverlässigkeitsverlauf

**Ausführungsort:** Betroffener Windows-PC.

Im Dialog `Win + R` Folgendes eingeben:

```powershell
# Startet den Windows-Zuverlässigkeitsverlauf.
# /rel wählt die Reliability-Ansicht aus.
perfmon /rel
```

Die Übersicht erleichtert es, Abstürze mit Installationsterminen oder Updates zeitlich zu vergleichen. **Korrelation allein beweist noch keine Ursache.**

### C – Task-Manager

Mit `Strg + Umschalt + Esc` öffnen. Unter **Prozesse** und **Details** prüfen: Existiert der betroffene Prozess? Nutzt er ungewöhnlich viel CPU oder Arbeitsspeicher? Reagiert er nicht? **Nicht sofort „Task beenden“ auswählen**, wenn ungespeicherte Arbeit verloren gehen könnte.

## 7. PowerShell-Diagnose – kommentiert und mit Ausführungsort

Die Beispiele verwenden **`InventarClient.exe` als fiktiven Programmnamen**. Im echten Ticket muss der tatsächliche Prozess- oder Dienstname bekannt sein. Alle Abfragen in diesem Kapitel sind lesend.

### 7.1 Prozess vorhanden?

**Ausführungsort:** Windows-Client, auf dem das Programm gestartet wurde. Alternativ in einem erlaubten PowerShell-Remote-Kontext.

```powershell
# Sucht nach dem laufenden Prozess „InventarClient“.
# Der Prozessname wird ohne die Endung „.exe“ angegeben.
# SilentlyContinue unterdrückt eine Fehlermeldung,
# wenn zum Zeitpunkt der Abfrage kein Prozess existiert.
$prozess = Get-Process -Name 'InventarClient' -ErrorAction SilentlyContinue

# Zeigt nur ausgewählte Eigenschaften an.
# Id ist die Prozessnummer (PID), CPU die kumulierte CPU-Zeit in Sekunden.
# WorkingSet64 ist der aktuell genutzte physische Speicher in Byte.
$prozess | Select-Object ProcessName, Id, CPU, WorkingSet64
```

**Interpretation:** Keine Ausgabe heißt nur, dass zum Abfragezeitpunkt kein passender Prozess ermittelt wurde. Die Anwendung kann bereits beendet worden sein oder einen anderen Prozessnamen besitzen. Eine hohe kumulierte CPU-Zeit ist **nicht** automatisch ein aktueller CPU-Spitzenwert.

### 7.2 Anwendungsabstürze der letzten 24 Stunden suchen

**Ausführungsort:** Betroffener Windows-Client mit Leseberechtigung für das Application-Protokoll.

```powershell
# Ermittelt den Zeitpunkt vor 24 Stunden.
$start = (Get-Date).AddHours(-24)

# Definiert den Filter für Abstürze im Anwendungsprotokoll.
$filter = @{
    # Windows-Protokoll „Anwendung“ auswählen.
    LogName = 'Application'

    # Ereignis-ID 1000: häufig „Application Error“.
    Id = 1000

    # Nur Ereignisse seit dem errechneten Startzeitpunkt.
    StartTime = $start
}

# Liest die passenden Ereignisse aus.
# Die Ausgabe kann mehrere verschiedene Anwendungen enthalten.
$ereignisse = Get-WinEvent -FilterHashtable $filter -ErrorAction SilentlyContinue

# Filtert die Meldung auf den fiktiven Programmnamen.
# Dies ist eine Textsuche: Schreibweise und Lokalisierung berücksichtigen.
$treffer = $ereignisse | Where-Object { $_.Message -like '*InventarClient.exe*' }

# Zeigt Zeitpunkt, Quelle, ID und Meldung an.
$treffer | Select-Object TimeCreated, ProviderName, Id, Message
```

**Interpretation:** Ein Treffer mit `ProviderName = Application Error` kann einen Absturz belegen. Der Eintrag nennt oft **Faulting application** (abgestürzte Anwendung), **Faulting module** (Modul, in dem der Fehler sichtbar wurde) und **Exception code** (Ausnahmecode). Das Fehlermodul beweist **nicht automatisch**, dass genau diese DLL defekt ist. Fehlende Treffer schließen einen Fehler nicht aus.

**Beispielbefund (fiktiv):**

```text
TimeCreated  : 07.11.2026 09:14:03
ProviderName : Application Error
Id           : 1000
Message      : Faulting application name: InventarClient.exe
               Faulting module name: InventarAddin.dll
               Exception code: 0xc0000005
```

Der Code `0xc0000005` verweist häufig auf eine Zugriffsverletzung im Speicher. Ohne weitere Diagnose ist nicht sicher, warum sie entstanden ist. Das angebliche Fehlermodul ist zunächst eine **Hypothese**, keine bewiesene Ursache.

### 7.3 Windows Error Reporting ergänzend prüfen

```powershell
# Sucht nach Windows Error Reporting (WER)-Ereignissen
# im Anwendungsprotokoll während der letzten 24 Stunden.
Get-WinEvent -FilterHashtable @{
    # Anwendungsprotokoll auswählen.
    LogName = 'Application'

    # WER-Ereignisse besitzen häufig diese Ereignis-ID.
    Id = 1001

    # Zeitfenster auf die letzten 24 Stunden beschränken.
    StartTime = (Get-Date).AddHours(-24)
} -ErrorAction SilentlyContinue |

# Gibt nur die ersten 20 Treffer aus, nicht nur für unsere App.
Select-Object -First 20 TimeCreated, ProviderName, Id, Message
```

**Warum ergänzend?** WER kann zusätzliche Problemberichte liefern. Ereignis 1001 kommt aber auch in anderen Kontexten vor. Den **ProviderName**, die Meldung und den Zeitpunkt immer mit dem tatsächlichen Problem abgleichen.

### 7.4 Abhängiger Windows-Dienst vorhanden?

**Ausführungsort:** Betroffener Client beziehungsweise zuständiger Server, auf dem der Dienst installiert sein sollte.

```powershell
# Prüft beispielhaft einen hypothetischen Dienst „InventarSync“.
# -ErrorAction vermeidet einen störenden Fehlertext,
# wenn der Dienst unter diesem Namen nicht existiert.
$dienst = Get-Service -Name 'InventarSync' -ErrorAction SilentlyContinue

# Zeigt Name, Anzeigename und aktuellen Dienststatus an.
$dienst | Select-Object Name, DisplayName, Status
```

**Interpretation:** `Stopped` bedeutet, dass der Dienst nicht läuft. Das ist nur dann ein Problem, wenn die Anwendung ihn für diesen Schritt benötigt und er tatsächlich laufen sollte. Ein fehlender Dienst beweist nichts, wenn die Anwendung gar keinen solchen Dienst verwendet.

### 7.5 Netzwerkabhängigkeit nur bei begründetem Verdacht prüfen

**Ausführungsort:** Betroffener Client. Die Beispieladresse ist bewusst fiktiv und muss ersetzt werden.

```powershell
# Testet eine TCP-Verbindung zum fiktiven Anwendungsserver.
# -ComputerName ist der Zielhostname.
# -Port 443 steht hier beispielhaft für HTTPS-Verbindungen.
Test-NetConnection -ComputerName 'app.firma.example' -Port 443
```

`TcpTestSucceeded : True` belegt nur die TCP-Erreichbarkeit dieses Ports, **nicht** die korrekte Funktion der Anwendung oder erfolgreiche Authentifizierung.

### 7.6 Windows-Version und Systeminformationen ermitteln

```powershell
# Liest Betriebssysteminformationen über CIM aus.
# CIM = Common Information Model, eine Verwaltungs-Schnittstelle.
Get-CimInstance -ClassName Win32_OperatingSystem |

# Zeigt ausgewählte Windows-Informationen an.
Select-Object Caption, Version, BuildNumber, OSArchitecture
```

**Reihenfolge:** Erst Symptome und Anwendungslogs; Systemdetails nur bei Bedarf ergänzen.

## 8. Welche Ursache passt zu welchem Befund?

| Technischer Befund | Plausible Ursache | Nächster sinnvoller Test |
|---|---|---|
| Programm beendet sich unmittelbar, Ereignis 1000 | Fehler in Programm, Add-in oder Abhängigkeit | Fehlermodul, Version, Änderungshistorie, Herstellerlog prüfen |
| Nur ein Benutzer betroffen | Benutzerprofil, individuelle Konfiguration, Berechtigung | Mit genehmigtem Testkonto vergleichen; Benutzerdaten sichern |
| Alle Benutzer auf einem Computer betroffen | Installation, lokaler Dienst, Systemkomponente | Installation, Dienststatus, Rechnerereignisse prüfen |
| Mehrere PCs nach Update betroffen | Anwendungsversion, zentraler Rollout | Versionen vergleichen und Rollout-Verantwortliche kontaktieren |
| Programm startet, meldet aber „Server nicht verfügbar“ | DNS, Netzwerk, Anwendungsserver, Lizenzdienst | Zielhostname, TCP-Port und Serverstatus prüfen |
| Fenster bleibt offen und reagiert nicht | Hängende Verarbeitung, blockierte Ressource oder Backend-Wartezustand | Ressourcen und Anwendungslogs prüfen, Datenverlust vermeiden |
| Ereignis nennt `KERNELBASE.dll` | Fehler zeigt sich in Windows-Bibliothek | **Nicht** automatisch `KERNELBASE.dll` ersetzen; tatsächlichen Aufrufkontext prüfen |
| Keine Ereignisse 1000/1001 | Fehler kann ohne klassischen Crash auftreten | Herstellerlogs, Benutzerkontext, Sicherheitspolitik, Hintergrundprozesse prüfen |

## 9. Lösungsmaßnahmen – von risikoarm nach eingriffsintensiv

**L1 – nach Freigabe und betrieblichem Verfahren:**

1. Fehler genau nachstellen und dokumentieren.
2. Einmaligen Neustart **der Anwendung** erwägen, nur wenn keine ungespeicherten Daten verloren gehen; vorher mit Benutzer abstimmen.
3. Hersteller- oder Windows-Anwendungsupdates **kontrolliert** prüfen; in verwalteten Unternehmen Updatefreigaben beachten.
4. Optionale Add-ins/Erweiterungen über die offiziell vorgesehene Funktion testweise deaktivieren, **nur wenn dokumentiert und reversibel**.
5. Falls unterstützt: **Reparieren** unter Windows 11 → *Einstellungen → Apps → Installierte Apps → [Anwendung] → Erweiterte Optionen → Reparieren* oder in *Systemsteuerung → Programme und Features → Ändern/Reparieren*. Nicht jede App bietet diese Funktion.
6. Funktionsprüfung durchführen: Anwendung starten, typischen Arbeitsablauf testen, relevante Logs erneut ansehen.

**Vorsicht bei „Zurücksetzen“:** Anders als „Reparieren“ kann diese Funktion Einstellungen und Anwendungsdaten löschen. Vorher Datensicherung, Herstellerhinweise und Freigabe klären. Eine Neuinstallation kann ähnlich problematisch sein.

**L2 – bei begründetem Befund:**

- Hersteller- oder anwendungsspezifische Logs korrelieren; Laufzeitumgebung, Treiber und Abhängigkeiten gezielt untersuchen.
- Bei wiederkehrenden Crashs das **Fehlermodul und den Exception Code** im Kontext anderer Befunde bewerten.
- Bei Verdacht auf Windows-Systemdateischäden und nach Freigabe zuerst die Komponentenspeicher-Reparatur über **DISM (Deployment Image Servicing and Management)**, danach **SFC (System File Checker)** prüfen. Diese Werkzeuge sind **keine Standardlösung für jeden App-Fehler**.
- Für schwierige Crashs eventuell **WER LocalDumps** oder **ProcDump (Sysinternals)** zur Speicherabbild-Erfassung verwenden. **Nur autorisiert**: Dumps können Kennwörter, personenbezogene Daten und Geschäftsgeheimnisse enthalten.
- Herstellerkontakt, reproduzierbaren Fehler und gesammelte technische Daten zusammenstellen.

### Nur bei nachgewiesenem Systemdateiverdacht: DISM und SFC

**Ausführungsort:** Betroffener Windows-Client, **erhöhte** PowerShell- oder Eingabeaufforderung; ggf. nach Change-Freigabe. Beide Befehle können Systemdateien verändern.

```powershell
# DISM: Prüft/repariert den Komponentenspeicher des laufenden Windows.
# /Online: Aktuell gestartetes Windows wird adressiert.
# /Cleanup-Image: Betriebssystemabbild wartungsbezogen bearbeiten.
# /RestoreHealth: Beschädigungen reparieren, soweit Quellen verfügbar.
DISM.exe /Online /Cleanup-Image /RestoreHealth

# SFC: Prüft und repariert geschützte Windows-Systemdateien.
# Zwischen Programmname und Parameter steht ein Leerzeichen.
sfc.exe /scannow
```

Die Reihenfolge DISM → SFC folgt der Microsoft-Anleitung, ist jedoch **nur bei passender Fehlerhypothese** sinnvoll. Sie kann Zeit beanspruchen und etwa durch fehlende Reparaturquellen scheitern.

### Was wir ausdrücklich nicht blind tun

- Keine unbekannten DLL-Dateien aus dem Internet herunterladen oder ersetzen.
- Keine Sicherheitssoftware oder Firewall pauschal abschalten.
- Keine Benutzerprofile, App-Daten oder Registrierungsschlüssel ohne Backup und Änderungsfreigabe löschen.
- Keine erzwungene Prozessbeendigung ohne Prüfung auf Datenverlust.
- Kein großflächiges Rollback ohne dokumentierte Ursachenhypothese und Freigabe.

## 10. Erfolgskontrolle

Ein Ticket gilt als gelöst, wenn die Anwendung **unter dem betroffenen Benutzerkonto** wieder startet und der ursprünglich fehlgeschlagene **Arbeitsablauf** erfolgreich ist. Idealerweise wird die Anwendung mehrfach unter denselben Bedingungen gestartet und ein Blick auf neue Fehlerereignisse geworfen. Bei Serverabhängigkeit Funktion und Zugriff auch nach erneuter Verbindung prüfen.

**Nur dass das Fenster erscheint, reicht nicht**: Eine Inventar-Anwendung muss beispielsweise auch eine Inventarbuchung speichern können.

## 11. Wann an den Second Level eskalieren?

- Kritische Anwendung betrifft mehrere Benutzer/Standorte.
- Reproduzierbarer Absturz trotz vorgesehener Standardmaßnahmen.
- Systemdienste, Server, Datenbank, Netz- oder Identitätsabhängigkeiten beteiligt.
- Sicherheitsereignis, verdächtige Anwendung, Datenverlust oder hohe betriebliche Auswirkung.
- Analyse von Crash-Dumps, Registry-, Treiber- oder Laufzeitumgebung nötig.
- Fehlende Berechtigung oder nicht absehbare Risiken einer Reparatur.

**Mitgeben:** Ticketnummer, genaue Meldung, Zeitpunkt/Zeitzone, Benutzer/Host, Version, Anzahl Betroffener, konkrete Reproduktionsschritte, bereits geprüfte Hypothesen, Logauszüge (redigiert) und Resultate. Keine Klartextkennwörter oder vertraulichen Daten in Tickets.

## 12. Muster-Ticketdokumentation (fiktiv)

> **INC-004 – InventarClient startet und beendet sich sofort**  
> **Fehlerbild:** Anwendung auf `PC-023` beendet sich nach dem Start bei einem Benutzer.  
> **Diagnose:** Fehler gemeinsam reproduziert. Im Anwendungsprotokoll trat zeitgleich ein Ereignis 1000 für `InventarClient.exe` auf. Gemeldetes Fehlermodul `InventarAddin.dll`. Prüfung ergab, dass das Add-in am Vortag aktualisiert wurde.  
> **Maßnahme:** Nach Freigabe und Sicherung der Einstellungen das Add-in gemäß Herstellerverfahren testweise deaktiviert.  
> **Ergebnis:** Anwendung ließ sich mehrfach öffnen; Inventarbuchung erfolgreich durchgeführt. Kein neuer Absturz während des Tests.  
> **Status:** Gelöst; Herstellerkorrektur für das Add-in nachverfolgen.  
> **Hinweis:** Dieses Beispiel wurde konstruiert und nicht praktisch ausgeführt.

**Beweislogik:** Die zeitliche Nähe zum Update und ein genanntes Modul allein beweisen die Ursache nicht. Erst der kontrollierte Vergleich vor/nach der Add-in-Änderung stärkt die Hypothese; für eine endgültige Herstelleranalyse können weitere Tests nötig sein.

## 13. Lernkontrolle / Active Recall

**Wissen:** Was ist der Unterschied zwischen Prozess und Dienst? Wofür stehen WER, PID und DLL? Mit welchem Befehl startet der Zuverlässigkeitsverlauf?

**Verständnis:** Warum ist ein Modulname im Ereignis 1000 kein endgültiger Ursachenbeweis? Warum ist `TcpTestSucceeded : True` kein Nachweis, dass die Anwendung funktioniert? Warum sollte man `sfc /scannow` nicht als ersten Schritt ausführen?

**Diagnose:** Benutzer A meldet, dass der Client nach einer neuen Erweiterung sofort abstürzt. Benutzer B hat denselben Client ohne Erweiterung und keine Probleme. Welche Hypothesen und zwei möglichst risikoarme Tests würdest du zuerst wählen? Formuliere anschließend einen Ticketkommentar mit klarer Trennung zwischen Befund und Vermutung.

**Anki-Vorbereitung:** Später getrennte Wissens-, Verständnis- und Diagnosekarten erzeugen; reale Testergebnisse erst nach eigener Durchführung ergänzen.

## 14. Visualisierung und Nachweisstand

- Infografik `assets/rb004_anwendungsfehler_infografik.png` ist eine **KI-gestützte illustrative Darstellung**, kein Screenshot eines echten Tickets.
- Diagnosebaum `assets/rb004_diagnosebaum.svg` ist ein **eigens erstelltes Ablaufdiagramm**.
- Terminalausgaben und Musterticket sind **fiktive Beispiele**.
- **Praktische Validierung ausstehend.** Für spätere Validierung: kontrollierter Test, Versionen, Schrittfolge, Ergebnis, Berechtigungen und gegebenenfalls eigener Screenshot festhalten.

**Bildkennzeichnung für die Website:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.

## 15. Offizielle Quellen und deren Verwendung

Alle Links führen zu den jeweils angegebenen Herstellerinformationen; geprüft am **07.11.2026**.

1. **[Microsoft Learn – Application or service crashing behavior](https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior)** – Ereignisse 1000/1001, Fehlermodule und fortgeschrittene Crashanalyse. Die Hinweise gelten laut Microsoft auch für unterstützte Windows-Clients.
2. **[Microsoft Learn – Get-WinEvent](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent?view=powershell-5.1)** – Protokollabfrage mit `-FilterHashtable`.
3. **[Microsoft Learn – perfmon](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/perfmon)** – Parameter `/rel` für den Zuverlässigkeitsverlauf.
4. **[Microsoft Learn – Get-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process?view=powershell-7.5)** – Prozessdiagnose.
5. **[Microsoft Learn – Get-Service](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-service)** – Dienststatusabfrage.
6. **[Microsoft Support – Apps und Programme in Windows reparieren](https://support.microsoft.com/de-de/windows/apps/repair-apps-and-programs-in-windows)** – Reparaturmöglichkeiten für installierte Anwendungen.
7. **[Microsoft Support – System File Checker](https://support.microsoft.com/de-de/windows/experience/backup-recovery/using-system-file-checker-in-windows)** – DISM und SFC bei Windows-Dateiproblemen.
8. **[Microsoft Learn – Collecting User-Mode Dumps](https://learn.microsoft.com/en-us/windows/win32/wer/collecting-user-mode-dumps)** – konfigurierte Speicherabbilder und Datenschutzrisiken.
9. **[Microsoft Sysinternals – ProcDump](https://learn.microsoft.com/de-de/sysinternals/downloads/procdump)** – erweitertes Crash-/Hang-Diagnosewerkzeug.

---

**Projekt:** 50 Tickets – 50 Supportfälle · **RB-004** · Recherchiert, noch nicht praktisch validiert.
