# RB-008 – Drucker druckt nicht

> **50 Tickets – 50 typische Supportfälle**  
> **Ticket:** INC-008 · **Support-Level:** 1st / 2nd Level · **Systeme:** Windows 11, Windows-Druckspooler, Netzwerkdrucker, Windows-Printserver  
> **Dokumentationsstand:** 08.11.2026 · **Version:** 1.0  
> **Validierungsstatus:** Anhand offizieller Microsoft-Dokumentation recherchiert; sämtliche Befunde, Systeme und Testergebnisse sind **fiktive Beispiele**, keine protokollierten Praxistests.

![RB-008: Drucker druckt nicht – Henne-Ei-Infografik](assets/rb008_henne_ei_drucker.png)

*Infografik: Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Illustrative Darstellung, kein Screenshot einer produktiven IT-Umgebung.*

## 1. Ausgangssituation – Was meldet der Benutzer?

**Fiktives Ticket INC-008:**

> „Ich habe in Word auf Drucken geklickt. Der Auftrag wird angezeigt, aber aus dem Drucker kommt nichts. Mein Kollege hat gerade noch etwas gedruckt.“

**Beispielumgebung:** Windows-11-Client `PC-023`, zentraler Printserver `PRINT01`, auf dem die Druckerfreigabe `\\PRINT01\Buero-2OG` bereitgestellt ist. Das physische Gerät heißt beispielhaft `PRN-2OG`. Alle Namen sind erfunden.

**Ziel:** Nachweisen, an welcher Stelle der Druckauftrag scheitert, die Ursache gezielt beheben und einen Testdruck erfolgreich kontrollieren. Der Support darf dabei keine fremden oder vertraulichen Dokumente unkontrolliert ausdrucken oder löschen.

**Wichtige Regel:** „Drucker druckt nicht“ ist nur ein **Symptom**. Eine Treiber-Neuinstallation oder ein Neustart des gesamten Printservers ist noch keine Diagnose.

## 2. Technische Grundlagen – Was passiert beim Drucken?

Die Verarbeitung sieht vereinfacht so aus:

```text
Anwendung auf PC (Word, Browser, PDF-Viewer)
                |
                v
Windows-Druckerobjekt + lokale Druckwarteschlange
                |
        +-------+----------------------+
        |                              |
        v                              v
Direkter Netzwerkdruck            Gemeinsame Druckerfreigabe
(Client → Drucker)                (Client → Printserver)
        |                              |
        |                              v
        |                       Server-Druckwarteschlange
        |                              |
        +----------------+-------------+
                         v
                  Netzwerkverbindung
                         |
                         v
                  Physischer Drucker
                  (Papier, Toner, Fehler)
```

**Wichtig:** Dieses Modell ist vereinfacht. Die tatsächliche Verarbeitung und Treiber-/Spooling-Verteilung können je nach Drucker, Treibermodell, Anschlussart und Richtlinie abweichen.

| Begriff | Anfängerfreundliche Erklärung | Relevanz bei Störungen |
|---|---|---|
| **Druckwarteschlange (Print Queue)** | Liste von Druckaufträgen, die auf ihre Verarbeitung warten oder verarbeitet werden. | Ein Auftrag kann dort hängen bleiben, pausiert sein oder einen Fehler zeigen. |
| **Spooler (Druckwarteschlangendienst)** | Windows-Dienst `Spooler`, der Druckaufträge verwaltet und an den weiteren Druckpfad übergibt. | Falls er nicht läuft oder hängen bleibt, können Aufträge nicht richtig verarbeitet werden. |
| **Printserver (Druckserver)** | Zentraler Computer/Server, der Drucker freigibt, Warteschlangen verwaltet und häufig Treiber bereitstellt. | Eine Serverstörung kann viele Benutzer gleichzeitig treffen. |
| **Druckertreiber (Printer Driver)** | Software, die Anwendungen und Windows beim Aufbereiten der Daten für den Drucker unterstützt. | Falsche bzw. defekte Treiber können falsche Ausgaben oder Abbrüche verursachen. |
| **Druckeranschluss (Port)** | Konfigurierter Übergabepunkt, über den Windows einen Drucker anspricht (etwa TCP/IP, USB oder WSD). | Falscher Port oder veraltete Zieladresse kann die Ausgabe verhindern. |
| **SMB (Server Message Block)** | Windows-Protokoll für unter anderem Datei- und bestimmte Netzwerkfreigaben; ersetzt keine vollständige Beschreibung aller Druckserver-Verbindungswege. | Beim Prüfen eines Printservers nicht bloß einen einzigen Netzwerkport als Gesamtbeweis ansehen. |
| **IP-Adresse (Internet Protocol)** | Netzwerkadresse des Druckers bzw. Printservers. | Eine falsche Adresse oder fehlende Route kann die Verbindung verhindern. |
| **DNS (Domain Name System)** | Übersetzt Namen wie `PRINT01` in IP-Adressen. | Falsche Namensauflösung verhindert möglicherweise die Verbindung zur Freigabe. |
| **GPO (Group Policy Object)** | Gruppenrichtlinienobjekt für zentral vorgegebene Einstellungen, z. B. Druckerzuweisungen. | Der Drucker kann durch eine geänderte Zuweisung fehlen. |
| **IPP (Internet Printing Protocol)** | Protokoll zur Übertragung und Verwaltung von Druckaufträgen; kann verschlüsselt verwendet werden. | Bei modernen Druckpfaden und Treibern relevant. |
| **WSD (Web Services for Devices)** | Windows-kompatible Methode zur Geräteerkennung und -kommunikation im Netzwerk. | Solche Druckeranschlüsse können andere Diagnosewege erfordern als TCP/IP-Ports. |
| **RAW / TCP 9100** | Häufige Druckerübertragung direkt an einen passenden Druckeranschluss über TCP-Port 9100. | Nur prüfen, **wenn genau diese Portart konfiguriert ist**. Nicht jeder Drucker nutzt 9100. |

Ein Drucker kann auch lokal per **USB (Universal Serial Bus)** angeschlossen sein – dann entfallen die Netzwerkprüfungen zum physischen Drucker.

**Quellen:** [Microsoft – Druckszenarien untersuchen](https://learn.microsoft.com/en-us/troubleshoot/windows-server/printing/troubleshoot-printing-scenarios) · [Microsoft – PrintManagement-Cmdlets](https://learn.microsoft.com/de-de/powershell/module/printmanagement/)

## 3. Erste Eingrenzung: Welches Problem liegt vor?

| Beobachtung | Erste Hypothese | Geeigneter Gegencheck |
|---|---|---|
| Druckerdisplay zeigt Papierstau oder „kein Papier“ | Hardware / Verbrauchsmaterial | Display und Geräte-Selbsttest prüfen. |
| Nur **eine Anwendung** kann nicht drucken | Anwendung, Dokument oder Rendering | Einfachen Text aus Editor/Notepad drucken. |
| Nur **ein Benutzer oder PC** betroffen | Lokale Warteschlange, Treiber, Benutzer-/Richtlinienkontext | Vergleichstest am selben Drucker von einem zweiten PC. |
| **Alle** Mitarbeiter an einem Standort betroffen | Printserver, Drucker, Netzwerk, zentrale Richtlinie | Status anderer Warteschlangen und Geräte prüfen. |
| Auftrag bleibt auf **Client** stehen | Lokale Warteschlange/Spooler/Verbindung zur Freigabe | Client-Warteschlange und Printserver-Warteschlange vergleichen. |
| Auftrag erreicht den **Printserver**, aber nicht den Drucker | Serverseitige Warteschlange, Port, Drucker oder Netzwerk | Server-Warteschlange und Anschlusskonfiguration prüfen. |
| Drucker wird als **offline** angezeigt | Gerät, Netzwerk oder Statusabfrage | Geräteanzeige, Netzverbindung und Port prüfen; „Offline“ allein ist kein Fehlerbeweis. |
| Auftrag verschwindet, aber kein Papier kommt | Drucker, Ausgabefach, Secure Print, anderer Drucker, Fehlrouting | Richtiges Gerät, Auftragsfreigabe am Gerät und Papierausgabe kontrollieren. |
| Drucker fehlt nach Anmeldung | Druckerzuweisung, Richtlinie, Treiberinstallation | Vorher vorhandene Verbindung und GPO-/Deployment-Status prüfen. |

**Wichtige Fragen:** Seit wann? Welcher Drucker? Aus welcher Anwendung? Ein oder mehrere Benutzer? Kommt eine Fehlermeldung? Ist Papier/Toner vorhanden? Ist der Auftrag in der Warteschlange? Wurde kürzlich ein Drucker, Treiber oder Netzwerk umgestellt? Gibt es vertrauliche Druckdaten?

## 4. Zugriffswege – Wo wird die Diagnose ausgeführt?

| Situation | Zugriffsweg | Konkretes Vorgehen und Grenze |
|---|---|---|
| Mitarbeiter ist angemeldet | Bildschirmfreigabe (z. B. Teams, Schnellhilfe) | Mitarbeiter zeigt Druckdialog, Warteschlange und Fehlermeldung; L1 führt ihn durch den Test. |
| Client ist remote erreichbar | Freigegebene Fernwartung, ggf. RDP (*Remote Desktop Protocol*) | Mit eigenem berechtigten Konto lokale Druckereinrichtung und Ereignisse prüfen. |
| Remoteverwaltungsrechte bestehen | PowerShell-Remoting über WinRM (*Windows Remote Management*) | Lesende Diagnosebefehle auf Zielclient ausführen; keine fremden Jobs ungeprüft entfernen. |
| Drucker ist zentral bereitgestellt | Autorisierter Zugriff auf den Printserver | Serverseitige Drucker, Warteschlangen, Spooler und Anschlüsse prüfen. |
| Drucker ist nicht erreichbar | Vor-Ort-Support | Geräte-Display, Kabel, Papier, Fehlercodes, IP-Adresse und mögliche Selbsttests prüfen. |
| Mehrere Drucker/Abteilungen betroffen | Zentrale IT / L2 | Printserverzustand, DNS, Routing, GPO, Richtlinien, Treiberänderungen und Wartungsfenster vergleichen. |

**Nicht erforderlich:** Bei einer Druckerstörung muss der Support nicht automatisch den Benutzer von seinem Desktop abmelden oder per RDP eine eigene Sitzung öffnen. Häufig reicht eine gemeinsame Bildschirmfreigabe.

## 5. Diagnose-Entscheidungsbaum

![RB-008: Technischer Diagnose-Entscheidungsbaum](assets/rb008_diagnosebaum.svg)

**Textalternative:** 1. Gerätefehler oder Testseitendruck am Gerät? → Hardware untersuchen; 2. nur ein Client? → lokale Warteschlange und Anwendung testen; 3. zentraler Printserver? → Auftrag auf Client und Server vergleichen; 4. Port und Netzwerk auf dem tatsächlichen Druckweg prüfen; 5. nachgewiesene Ursache gezielt beheben, Funktionskontrolle dokumentieren.

## 6. Hardware- und Anwendungstest (typisch L1)

### A – Drucker vor Ort untersuchen

1. Statusdisplay und genaue Fehlercodes dokumentieren.
2. Papier, Toner/Tinte, Papierstau, Klappen und Ausgabefächer prüfen.
3. Nachsehen, ob ein Druckauftrag am Gerät selbst noch **freigegeben** werden muss, z. B. „Secure Print“ oder Ausweiskarten-Freigabe.
4. Wenn der Hersteller es vorsieht, eine **Geräte-Selbsttestseite** direkt am Drucker ausgeben.

**Warum ein Selbsttest?** Er prüft Teile der Druckerhardware, ohne dass zuvor ein Windows-Druckauftrag gesendet werden muss. Funktioniert er nicht, beginnt die Diagnose beim Gerät statt bei Windows.

### B – Anwendung eingrenzen

- Aus `Editor`/Notepad eine kurze Testzeile drucken (nur auf einem freigegebenen, unkritischen Drucker).
- Falls das funktioniert, denselben Drucker aus der ursprünglichen Anwendung testen.
- Eine **Windows-Testseite** über die Druckereigenschaften ausgeben, wenn dies zulässig ist.

**Interpretation:** Kann nur eine Anwendung nicht drucken, liegt die Ursache eher im Dokument, der Anwendung oder ihrer Interaktion mit dem Treiber. Nicht sofort den kompletten Druckdienst zurücksetzen.

## 7. Druckerobjekt und Warteschlange mit PowerShell untersuchen

**Ausführungsort:** Betroffener Windows-Client, Windows PowerShell mit PrintManagement-Modul. Die folgenden Abfragen sind lesend. Je nach Zielsystem sind Leseberechtigungen erforderlich.

### A – Drucker und Anschluss auflisten

```powershell
# Get-Printer liest die auf diesem Windows-System installierten
# bzw. verbundenen Druckerobjekte aus.
Get-Printer |

    # Wählt die wichtigsten Diagnosefelder aus:
    # Name = Anzeigename in Windows.
    # PrinterStatus = von Windows gemeldeter Druckerstatus.
    # DriverName = zugeordneter Treiber.
    # PortName = verwendeter Druckeranschluss.
    Select-Object Name, PrinterStatus, DriverName, PortName
```

**Wichtig:** `PrinterStatus` kann unvollständig oder nicht aktuell sein. Ein angezeigter Status „Normal“ beweist nicht, dass Papier ausgegeben wird.

### B – Druckaufträge lesen

```powershell
# Name des Druckerobjekts – an die tatsächliche Ausgabe
# von Get-Printer anpassen. Das ist nur ein BEISPIELNAME.
$drucker = 'Buero-2OG'

# Liest ausschließlich die Druckaufträge dieser Warteschlange.
# Es werden keine Aufträge beendet oder gelöscht.
Get-PrintJob -PrinterName $drucker |

    # Zeigt die Auftragsnummer, den Zustand und weitere Daten.
    Select-Object ID, UserName, DocumentName, JobStatus, Size, SubmittedTime
```

**Datenschutz:** Auftrags- und Dokumentnamen können vertrauliche Informationen enthalten. In Tickets nur notwendige, freigegebene Daten übernehmen.

**Interpretation:** Ein hängender Job kann Ursache **oder Folge** eines anderen Problems sein. Die Meldung allein belegt noch keinen defekten Spooler.

**Quellen:** [Get-Printer](https://learn.microsoft.com/en-us/powershell/module/printmanagement/get-printer) · [Get-PrintJob](https://learn.microsoft.com/en-us/powershell/module/printmanagement/get-printjob)

## 8. Spooler prüfen: Der Windows-Druckwarteschlangendienst

**Was ist der Spooler?** Der Windows-Dienst mit dem Dienstnamen `Spooler` organisiert Druckaufträge. Er arbeitet auf Windows-Clients und – sofern ein Windows-Printserver eingesetzt wird – auch auf diesem Server. Es handelt sich um **verschiedene Dienstinstanzen**.

### A – Dienststatus lesen

```powershell
# Get-Service liest Windows-Dienste und ihren Status aus.
# -Name 'Spooler' wählt gezielt den Druckwarteschlangendienst.
Get-Service -Name 'Spooler' |

    # Zeigt Anzeigename, internen Namen und Zustand an.
    Select-Object DisplayName, Name, Status, StartType
```

**Beispielbefund (fiktiv):** `Status : Stopped` könnte erklären, weshalb lokale Druckjobs nicht weitergegeben werden. Vor dem Start prüfen, **warum** der Dienst gestoppt wurde – etwa durch eine Sicherheitsrichtlinie, einen Crash oder eine bewusste Administration.

### B – Gezielte Maßnahme: Spooler neu starten (ÄNDERND)

```powershell
# ACHTUNG: VERÄNDERNDER BEFEHL – nur mit Freigabe einsetzen.
# Restart-Service startet den Dienst neu.
# -Name legt den betroffenen Dienst fest.
# -WhatIf simuliert, soweit vom Cmdlet unterstützt,
# die beabsichtigte Operation ohne Ausführung.
Restart-Service -Name 'Spooler' -WhatIf

# NUR NACH FREIGABE: Neustart des Spoolers.
# Kann laufende oder wartende Druckaufträge unterbrechen.
# Auf einem PRINTSERVER sind möglicherweise VIELE Nutzer betroffen.
# Restart-Service -Name 'Spooler'
```

**Wichtig:** Ein Spooler-Neustart löscht nicht zwangsläufig alle Aufträge. Eine getrennte Löschung der Spool-Dateien unter `%windir%\System32\spool\PRINTERS` betrifft potenziell sämtliche dort gespeicherten Aufträge und darf deshalb **nicht** als pauschaler erster Schritt eingesetzt werden.

**Quelle:** [Microsoft – Druckprobleme bei gestopptem Spooler](https://learn.microsoft.com/en-us/troubleshoot/windows-server/printing/print-spooler-service-not-running)

## 9. Einzelnen blockierten Auftrag prüfen und nach Freigabe entfernen

**Ausführungsort:** Das Windows-System, auf dessen Warteschlange sich der Auftrag befindet (Client oder Printserver). Berechtigungen hängen von Benutzerrolle und Eigentümer des Druckjobs ab.

```powershell
# Anpassen: Druckername und tatsächliche Jobnummer erst ermitteln.
$drucker = 'Buero-2OG'
$auftragId = 17

# Liest den betreffenden Auftrag zur Kontrolle.
Get-PrintJob -PrinterName $drucker -ID $auftragId |
    Select-Object ID, UserName, DocumentName, JobStatus

# SIMULATION: Würde genau diesen einen Auftrag entfernen.
# -WhatIf verändert die Warteschlange nicht.
Remove-PrintJob -PrinterName $drucker -ID $auftragId -WhatIf

# NUR NACH BESTÄTIGUNG / FREIGABE:
# Entfernt genau den bezeichneten Auftrag.
# Remove-PrintJob -PrinterName $drucker -ID $auftragId
```

**Sicherheitsregel:** Vor dem Löschen auf einem gemeinsam genutzten Printserver prüfen, wem der Auftrag gehört und ob der Auftrag erneut versendet werden muss. Unberechtigtes Löschen fremder Jobs vermeiden.

**Quelle:** [Microsoft Learn – Remove-PrintJob](https://learn.microsoft.com/en-us/powershell/module/printmanagement/remove-printjob)

## 10. Printserver und Netzwerk systematisch unterscheiden

### A – Serverseitige Warteschlange lesen

**Ausführungsort:** Berechtigter Administrationsrechner mit Netzwerkzugang und passenden Rechten. `PRINT01` ist ein fiktiver Servername.

```powershell
# Listet vom Druckserver PRINT01 verwaltete Drucker auf.
# -ComputerName fragt das benannte entfernte System ab.
Get-Printer -ComputerName 'PRINT01' |
    Select-Object Name, PrinterStatus, DriverName, PortName

# Liest die Druckjobs einer konkreten Freigabe/Queue
# direkt auf dem angegebenen Printserver.
Get-PrintJob -ComputerName 'PRINT01' -PrinterName 'Buero-2OG' |
    Select-Object ID, UserName, DocumentName, JobStatus
```

**Interpretation:** Fehlt der Job auf dem Server, untersuchen wir zuerst den Client und dessen Verbindung zum Printserver. Ist der Auftrag auf dem Server vorhanden und bleibt dort stehen, sind dessen Warteschlange, Port, Netzwerk und physischer Drucker die nächsten Prüfpunkte. Das ist keine mathematisch eindeutige Beweiskette; Treibermodelle und Verarbeitung können variieren.

### B – Druckerport auf dem zuständigen System prüfen

```powershell
# Liest alle auf PRINT01 konfigurierten Druckeranschlüsse.
# Je nach Anschlusstyp stehen nicht alle Felder zur Verfügung.
Get-PrinterPort -ComputerName 'PRINT01' |
    Select-Object Name, PrinterHostAddress, PortNumber, Protocol
```

Wenn ein **Standard TCP/IP Port mit RAW TCP 9100** tatsächlich konfiguriert ist, lässt sich beispielhaft die Verbindung von Printserver zu Drucker testen:

```powershell
# BEISPIEL-IP aus dem reservierten Dokumentationsnetz;
# gegen die echte, freigegebene Drucker-IP ersetzen.
# Dieser Test ist nur bei konfiguriertem TCP-Port 9100 sinnvoll.
Test-NetConnection -ComputerName '192.0.2.45' -Port 9100
```

**Interpretation:** `TcpTestSucceeded : True` bedeutet nur: Eine TCP-Verbindung zu diesem Port war möglich. Es bedeutet **nicht**, dass der Drucker korrekt druckt. `False` kann auf Firewall, Routing, ausgeschaltetes Gerät, falsche Adresse oder einen anderen verwendeten Druckdienst hinweisen.

**Nicht verwechseln:** Eine Verbindung zum **Printserver** und eine Verbindung vom **Printserver zum Drucker** sind zwei verschiedene Netzwerkstrecken. Ein Test auf TCP 9100 gegen den Printserver ist bei zentral freigegebenen Druckern gewöhnlich nicht der passende Nachweis.

**Quellen:** [Get-PrinterPort](https://learn.microsoft.com/en-us/powershell/module/printmanagement/get-printerport) · [Microsoft – Druckprobleme und bewährte Verfahren](https://learn.microsoft.com/en-us/troubleshoot/windows-server/printing/troubleshoot-printing-and-best-practices)

## 11. Druckertreiber, Bereitstellung und Sicherheitsrichtlinien (L2)

### A – Treiber ermitteln

```powershell
# Liest die auf dem Printserver installierten Druckertreiber.
# Das Ergebnis ist ein Inventar, keine automatische Fehlersuche.
Get-PrinterDriver -ComputerName 'PRINT01' |
    Select-Object Name, Manufacturer, PrinterEnvironment
```

**Befund:** Probleme nur nach einem Treiberupdate, fehlerhafte Schriftzeichen oder Druckabbrüche in bestimmten Anwendungen können auf Treiber- oder Rendering-Probleme hindeuten. Die Ursache wird mit Vergleichsdrucken und Herstellerhinweisen eingegrenzt – nicht durch pauschales Entfernen aller Treiber.

### B – Warum kann die Druckerinstallation an Berechtigungen scheitern?

Windows kann die Installation von Druckertreibern durch nicht privilegierte Benutzer beschränken. Die Funktion **Point and Print** (Verbinden mit einem freigegebenen Drucker und ggf. Beziehen des Treibers) unterliegt Sicherheitsrichtlinien. Eine Meldung „Administratorrechte erforderlich“ ist deshalb nicht automatisch eine Fehlkonfiguration.

**Kein zulässiger Schnelltrick:** Drucker-Sicherheitsrichtlinien nicht zur Problemlösung abschalten, nur damit ein Treiber installiert werden kann. Freigegebenes Deployment oder geeignete administrative Installation verwenden.

### Zwischenfrage: Wird der Drucker über eine GPO zugewiesen?

Eine **Gruppenrichtlinie (GPO, Group Policy Object)** kann dafür sorgen, dass ein Mitarbeiter nach dem Anmelden automatisch einen Unternehmensdrucker in Windows sieht. Das ist eine **Druckerbereitstellung beziehungsweise -zuweisung** – noch kein Beweis, dass der Druckpfad tatsächlich funktioniert. Nach der Bereitstellung müssen Druckerzugriff, Treiber, Printserver, Warteschlange und Gerät weiterhin passen. Fehlt ein Drucker, prüfen wir daher zuerst die Zuweisung; ist er vorhanden, aber druckt nicht, untersuchen wir die nachgelagerte Druckverarbeitung.

### C – Neueres Windows: Protected Print

Der **Windows Protected Print Mode** kann – wenn durch Benutzer oder Organisation aktiviert – die Nutzung älterer Drittanbieter-Druckertreiber einschränken. Dadurch können zuvor verwendete Druckerinstallationen nicht mehr nutzbar sein. Das ist ein **gezielter Prüfschritt**, wenn nach einer Umstellung Drucker fehlen; nicht automatisch eine Empfehlung, den Schutz auszuschalten.

Microsoft hat außerdem seine Roadmap für ältere Drittanbieter-Druckertreiber geändert, darunter die Bevorzugung des Windows-IPP-Klassentreibers seit Juli 2026. Für konkrete Geräte gelten weiterhin Kompatibilitäts- und Herstellerangaben.

**Quellen:** [Point-and-Print-Richtlinien](https://learn.microsoft.com/en-us/troubleshoot/windows-client/group-policy/point-print-restrictions-policies-ignored) · [Windows Protected Print Mode](https://learn.microsoft.com/en-us/windows/modern-print/windows-protected-print-mode/windows-protected-print-mode) · [Roadmap für Druckertreiber](https://learn.microsoft.com/de-de/windows-hardware/drivers/print/end-of-servicing-plan-for-third-party-printer-drivers-on-windows)

## 12. Druckereignisse und Fehlermeldungen untersuchen

Windows verfügt über den Ereigniskanal `Microsoft-Windows-PrintService/Operational`. Dort können bei passender Konfiguration Druckereignisse protokolliert sein; **Ereignis 307** kann einen durch Windows als verarbeitet bzw. gedruckt gemeldeten Auftrag anzeigen. Es beweist nicht notwendigerweise, dass ein Blatt wirklich im Ausgabefach liegt.

**Ausführungsort:** Betroffener Client oder Printserver, dessen Druckprotokoll untersucht werden soll.

```powershell
# Fragt ab, ob der PrintService-Operational-Kanal vorhanden
# und aktiviert ist (lesende Diagnose).
Get-WinEvent -ListLog 'Microsoft-Windows-PrintService/Operational' |
    Select-Object LogName, IsEnabled, RecordCount

# Nur ausführen, wenn der Kanal existiert und aktiv ist.
# Liest bis zu 20 vorhandene Druckereignisse aus den
# letzten 24 Stunden – keine Einstellung wird verändert.
$filter = @{
    LogName   = 'Microsoft-Windows-PrintService/Operational'
    StartTime = (Get-Date).AddHours(-24)
}

Get-WinEvent -FilterHashtable $filter -MaxEvents 20 |
    Select-Object TimeCreated, Id, LevelDisplayName, Message
```

**Hinweis:** Wenn das Protokoll deaktiviert oder leer ist, ist das kein Nachweis, dass es keine Druckfehler gab. Ohne ausreichende Rechte kann die Abfrage fehlschlagen. Vor dem Einschalten zusätzlicher Protokollierung am Printserver die betriebliche Freigabe klären.

## 13. Diagnosebefund → gezielte Maßnahme

| Nachgewiesener Befund | Zielgerichteter nächster Schritt | Grenze / Risiko |
|---|---|---|
| Papierstau, Fach leer, Verbrauchsmaterial | Gerät vor Ort gemäß Herstelleranleitung wieder betriebsbereit machen. | Keine mechanischen Eingriffe außerhalb der Einweisung. |
| Nur eine Anwendung betroffen | Vergleichsdruck, App-Einstellungen und Rendering prüfen. | Keine wahllose Systemreparatur. |
| Ein lokaler Job hängt, andere drucken | Genau diesen Job prüfen und ggf. mit Zustimmung entfernen. | Dokumentname kann vertraulich sein. |
| Spooler auf einem Client abgestürzt | Fehlerereignisse sichern; kontrolliert neu starten, falls freigegeben. | Benutzer über Druckunterbrechung informieren. |
| Printserver-Warteschlange für mehrere Benutzer blockiert | L2 mit Auswirkungen auf alle betroffenen Benutzer; gezielte Maßnahme koordinieren. | Kein ungeplanter globaler Spooler-Reset. |
| Printserver erreicht den physischen Drucker nicht | Port, IP, Routing, Firewall und Druckerzustand prüfen. | Port 9100 nur testen, wenn tatsächlich verwendet. |
| Drucker nach Deployment-/Treiberänderung verschwunden | GPO, Bereitstellung, Treiber-/Protected-Print-Richtlinie prüfen. | Keine Sicherheitsrichtlinien eigenmächtig aufweichen. |
| Druckauftrag „erledigt“, aber keine Ausgabe | Richtiges Gerät, Secure-Print-Freigabe, falsches Ausgabefach, Druckermeldungen prüfen. | Protokollstatus ist kein physischer Druckbeweis. |

## 14. Erfolgskontrolle und Eskalation

**Erfolgskontrolle:**

1. Testdruck aus der ursprünglichen Anwendung und gegebenenfalls aus einem zweiten Programm erfolgreich.
2. Papierausgabe am **richtigen** physischen Gerät kontrolliert oder durch Benutzer bestätigt.
3. Warteschlange frei von dem konkret störenden Auftrag; keine erneuten Blockierungen im Beobachtungszeitraum.
4. Falls mehrere betroffen waren: Funktion bei einem zweiten Benutzer nachprüfen.
5. Dokumentierte Maßnahmen haben keine fremden Aufträge, Sicherheitsrichtlinien oder Printserverfunktionen unzulässig verändert.

**Eskalation an L2 / Printserver-Team:** Wenn mehrere Benutzer oder Drucker ausfallen; zentrale Warteschlange oder Treiberverwaltung betroffen ist; Sicherheitsrichtlinien greifen; Netzwerksegment/VLAN/Firewall geändert wurde; wiederholt Spooler-Abstürze auftreten; Firmware-/Hardwarestörungen vorliegen oder Änderungen am Printserver notwendig werden.

## 15. Muster-Ticketkommentar, Lernkontrolle und Quellen

### Muster-Ticketabschluss – ausdrücklich fiktiv

**Ticket:** INC-008 · **Status:** Gelöst (fiktives Übungsbeispiel)

**Fehlerbild:** Benutzer kann über `\\PRINT01\Buero-2OG` keine Dokumente drucken. Andere Benutzer können den gleichen Drucker verwenden.

**Diagnose:** Druckerdisplay ohne Fehler. Druckversuch aus Editor reproduziert; Auftrag blieb in der lokalen Warteschlange von `PC-023` stehen. Serverseitige Warteschlange `Buero-2OG` zeigte den betreffenden Auftrag nicht. Lokaler Spooler aktiv, anschließend wartender Auftrag untersucht.

**Ursache:** Ein einzelner lokaler Druckauftrag ließ sich nicht regulär verarbeiten; keine Hinweise auf zentrale Druckerstörung. Weitere technische Ursache wurde im Beispiel nicht abschließend bestimmt.

**Maßnahme:** Betroffenen Auftrag nach Rücksprache mit dem Benutzer gezielt entfernt und Testdruck erneut gesendet.

**Ergebnis:** Testseite sowie Testdokument aus der ursprünglichen Anwendung wurden erfolgreich am richtigen Drucker ausgegeben. Keine weitere Blockierung während der Kontrolle festgestellt.

**Wichtig:** Die Ursache wird **nicht erfunden**: Wenn nur das Symptom behoben und die tieferliegende Ursache unklar blieb, muss das Ticket dies offen benennen.

### Drei Kartentypen für spätere Anki-Übernahme

| Typ | Frage | Kurze Antwort |
|---|---|---|
| Wissen | Wofür steht „Spooler“ im Druckpfad? | Windows-Dienst zur Verwaltung von Druckaufträgen. |
| Wissen | Welcher Befehl zeigt lokale Druckjobs? | `Get-PrintJob -PrinterName 'Name'` |
| Verständnis | Warum reicht „Port 9100 offen“ nicht als Drucknachweis? | TCP erreichbar ≠ korrekte Druckverarbeitung/Papierausgabe. |
| Verständnis | Warum ist ein Printserver-Spooler-Neustart riskant? | Er betrifft möglicherweise Druckaufträge vieler Benutzer. |
| Diagnose | Client-Job vorhanden, Server-Job fehlt: Wo prüfen? | Client-Warteschlange und Verbindung zum Printserver. |
| Diagnose | Nur Word scheitert, Editor druckt: erste Hypothese? | Anwendung, Dokument oder deren Treiberinteraktion. |

### Offene Diagnoseübung (ohne Lösungsvorgabe)

Ein Mitarbeiter meldet: „Der Druckauftrag verschwindet nach drei Sekunden aus meiner Warteschlange. Das Druckerdisplay meldet ‚Bereit‘. Zwei Kollegen erhalten Druckausgaben, allerdings erst, nachdem sie ihren Mitarbeiterausweis am Drucker benutzen.“

**Aufgabe:** Welche **drei Prüfungen** führst du zuerst durch? Formuliere die erste Hypothese und einen professionellen Ticket-Zwischenstand. Prüfe dabei, ob die Sicherheitsrichtlinie der Druckumgebung eine Rolle spielt.

### Technische Referenzen (Recherche 08.11.2026)

1. [Microsoft – Troubleshooting scenarios for printing](https://learn.microsoft.com/en-us/troubleshoot/windows-server/printing/troubleshoot-printing-scenarios) – Fehlerbilder, Vergleichsdruck und Spoolerverarbeitung.
2. [Microsoft – Troubleshoot printing and best practices](https://learn.microsoft.com/en-us/troubleshoot/windows-server/printing/troubleshoot-printing-and-best-practices) – Prüfung von Client, Printserver, Gerät und Netzwerk.
3. [Microsoft – Printer not responding](https://learn.microsoft.com/de-de/troubleshoot/windows-server/printing/printer-not-responding) – Druckwarteschlange und Spooler.
4. [Microsoft – PrintManagement PowerShell module](https://learn.microsoft.com/de-de/powershell/module/printmanagement/) – Übersicht von `Get-Printer`, `Get-PrintJob` und verwandten Cmdlets.
5. [Microsoft – Get-PrintJob](https://learn.microsoft.com/en-us/powershell/module/printmanagement/get-printjob) – Druckjobs lesen.
6. [Microsoft – Remove-PrintJob](https://learn.microsoft.com/en-us/powershell/module/printmanagement/remove-printjob) – Druckjobs gezielt entfernen; `-WhatIf`.
7. [Microsoft – Print Spooler service not running](https://learn.microsoft.com/en-us/troubleshoot/windows-server/printing/print-spooler-service-not-running) – Dienstprobleme und mögliche Ursachen.
8. [Microsoft – Windows Protected Print Mode](https://learn.microsoft.com/en-us/windows/modern-print/windows-protected-print-mode/windows-protected-print-mode) – Moderne Sicherheits-/Treiberanforderungen.
9. [Microsoft – Druckertreiber-Roadmap](https://learn.microsoft.com/de-de/windows-hardware/drivers/print/end-of-servicing-plan-for-third-party-printer-drivers-on-windows) – Änderungen beim Treibermodell.
10. [Microsoft – Point and Print restrictions](https://learn.microsoft.com/en-us/troubleshoot/windows-client/group-policy/point-print-restrictions-policies-ignored) – Sicherheitsrichtlinien bei Druckerverbindungen.

**Projektstatus:** Quellenbasierte technische Dokumentation, **nicht praktisch validiert**. Alle Systemnamen, Befunde und Testausgaben sind konstruiert. Praktische Screenshots und Labortests können später getrennt ergänzt werden.
