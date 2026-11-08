# RB-007 – Windows-PC oder Laptop ist ungewöhnlich langsam

> **50 Tickets – 50 typische Supportfälle**  
> **Ticket:** INC-007 · **Support-Level:** 1st / 2nd Level · **System:** Windows 11, PowerShell, Task-Manager, Leistungsüberwachung  
> **Stand:** 08.11.2026 · **Version:** 1.0  
> **Validierungsstatus:** Anhand offizieller Microsoft-Dokumentation recherchiert. Alle Fehlerbeispiele und Messergebnisse sind **fiktiv**. Es wird keine praktische Systemvalidierung behauptet.

![RB-007: Ein langsamer Windows-PC – der Henne-Ei-Diagnoseweg](assets/rb007_henne_ei_performance.png)

*Infografik: Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Didaktisches Modell, keine Aufnahme eines realen Supportfalls.*

## 1. Ausgangssituation – Was meldet der Benutzer?

**Fiktives Ticket INC-007:**

> „Mein Laptop ist seit gestern extrem langsam. Teams und der Browser brauchen ewig, und manchmal reagiert gar nichts mehr. Mein Kollege hat das Problem nicht.“

**Beispielumgebung:** Windows-11-Laptop `PC-023`, Unternehmensbenutzer, Anwendungen wie Teams, Browser und Microsoft 365. Der Name `PC-023` ist frei erfunden.

**Ziel:** Die Verzögerung reproduzieren, den betroffenen Systembereich eingrenzen, geeignete Messdaten erfassen, die wahrscheinliche Ursache überprüfen und anschließend die Leistung unter vergleichbaren Bedingungen erneut testen.

**Grundregel:** „PC langsam“ ist zunächst **ein Symptom**, keine Ursache. Ein Neustart oder die Deinstallation einer Anwendung kann das Symptom verdecken, ohne das Problem nachhaltig zu beheben.

## 2. Grundlagen – Was kann einen PC langsam machen?

Ein Windows-PC verarbeitet Aufgaben über verschiedene Ressourcen. Fehlt einer Ressource vorübergehend Leistung, entsteht ein **Engpass** (*Bottleneck*: ein Teil des Systems begrenzt den gesamten Ablauf).

| Begriff | Anfängerfreundliche Erklärung | Typisches Zeichen |
|---|---|---|
| **CPU (Central Processing Unit)** | Prozessor: verarbeitet Rechenaufgaben. | Ein Prozess beansprucht über längere Zeit viel Rechenleistung; Reaktionen verzögern sich. |
| **RAM (Random Access Memory)** | Arbeitsspeicher: hält gerade benötigte Daten schnell bereit. | Wenig verfügbarer Speicher; häufiges Nachladen, Anwendungen reagieren verzögert. |
| **SSD (Solid State Drive)** | Schneller Datenträger ohne bewegliche Teile. | Bei hoher Auslastung, langen Antwortzeiten oder Problemen können Dateioperationen stocken. |
| **HDD (Hard Disk Drive)** | Magnetische Festplatte mit mechanischen Teilen. | Besonders bei vielen kleinen Zugriffen können lange Wartezeiten entstehen. |
| **Datenträger-E/A (Ein-/Ausgabe)** | Lesen und Schreiben von Daten auf SSD oder HDD. | Dateiöffnen, Programmstart und Speichern sind langsam. |
| **Auslagerungsdatei (Pagefile)** | Windows kann Speicherseiten bei Bedarf auf Datenträger auslagern. | Bei starkem Speicherdruck möglicherweise zusätzliche langsame Laufwerkszugriffe. |
| **Autostart** | Anwendungen, die bei Anmeldung oder Systemstart automatisch beginnen. | Langsames Hochfahren oder Anmelden, viele Programme starten zugleich. |
| **Dienst (Service)** | Hintergrundkomponente von Windows oder installierter Software. | Kann CPU, RAM, Netzwerk oder Datenträger verwenden, ohne sichtbar zu sein. |
| **Treiber** | Software, die Hardware mit Windows verbindet. | Fehler können Wartezeiten, hohe Unterbrechungslast oder instabiles Verhalten auslösen. |
| **Drosselung (Throttling)** | Prozessor oder Grafikeinheit senkt Leistung, z. B. wegen Hitze oder Energiesparvorgaben. | Gerät wird unter längerer Last langsamer, Lüfter auffällig, Frequenz niedriger. |
| **Latenz** | Verzögerung zwischen Anfrage und Antwort. | Vor allem Netzlaufwerke, Webanwendungen oder Remotedesktop reagieren träge. |

**Wichtig:** 80 % RAM-Nutzung oder kurzzeitig 100 % CPU sind **für sich allein kein Fehlerbeweis**. Entscheidend sind Dauer, Benutzerwirkung, Vergleich mit Normalzustand und zusätzliche Messwerte. Der Dateicache verwendet absichtlich Arbeitsspeicher, um Zugriffe zu beschleunigen.

**Quelle:** [Microsoft Support – Tipps zur Verbesserung der PC-Leistung](https://support.microsoft.com/de-de/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows)

## 3. Erste Eingrenzung: Welche Art von Langsamkeit?

Die erste Frage lautet nicht „Was löschen wir?“, sondern **„Was ist genau langsam?“**

| Beobachtung | Denkbare Ursachen | Erster Test |
|---|---|---|
| Gesamter PC seit Start langsam | CPU, RAM, Datenträger, Autostart, Treiber | Task-Manager → Prozesse und Leistung |
| Nur ein Programm langsam | App, Add-In, Nutzerprofil, Backend | Andere Anwendungen vergleichen; Ereignis-/App-Logs |
| Vor allem nach Windows-Anmeldung langsam | Autostart, Anmeldeskripte, Richtlinien, Synchronisierung | Task-Manager → Autostart-Apps, Zeitverlauf |
| Nur Netzlaufwerke / Microsoft-365-Dienste langsam | WLAN, LAN, VPN, DNS, Server, Proxy | Lokale Programme mit Netzwerk-Anwendungen vergleichen |
| Nach Update deutlich langsamer | Updatevorgang, Treiber, Nacharbeiten, Softwareänderung | Zeitpunkt dokumentieren, Zuverlässigkeitsverlauf |
| Laptop im Akkubetrieb langsamer | Energiemodus, Batteriestand, Temperatur | Netzteil-/Akkuzustand und Energieeinstellungen prüfen |
| Langsamkeit nur unter Dauerlast | Kühlung, Temperatur, Ressourcenengpass | Lastverlauf und Hardwarezustand prüfen |
| Mehrere PCs gleichzeitig betroffen | Gemeinsamer Dienst, Netzwerk, Update- oder Sicherheitssoftware | Betroffenheit sammeln und zentral eskalieren |

**Wichtige Rückfragen:** Seit wann? Dauerhaft oder gelegentlich? Welche Aktion ist langsam? Wie lange dauert sie normalerweise und aktuell? Ein oder mehrere Benutzer/Geräte? Änderungen seit gestern? Akkubetrieb? Wird das Gerät heiß? Daten bereits gesichert?

## 4. Wie erhält der Support Zugriff? (Berechtigungen und Ablauf)

| Situation | Zugriffsweg | Konkretes Vorgehen und Grenze |
|---|---|---|
| Benutzer ist angemeldet und der PC reagiert | Bildschirmfreigabe (z. B. Teams, Schnellhilfe) | Benutzer öffnet den Task-Manager, Support beobachtet; gemeinsame Ursachenanalyse ohne eigene Anmeldung. |
| Client ist über das Unternehmensnetz erreichbar | Autorisierte Fernwartung oder RDP (*Remote Desktop Protocol*) | Mit eigenem berechtigtem Konto diagnostizieren; RDP ersetzt nicht unbedingt die gemeinsame Benutzersitzung. |
| Kein grafischer Zugriff nötig, WinRM freigegeben | PowerShell-Remoting über WinRM (*Windows Remote Management*) | Lesende Diagnosebefehle remote ausführen, z. B. Prozess-/Speicherinformationen. |
| PC reagiert gar nicht oder ist offline | Telefonisch / vor Ort | Netzteil, Statusanzeigen, Gerätestart und gegebenenfalls Hardware überprüfen. |
| Mehrere PCs betroffen | Verwaltungssystem / zentrale IT | Update-, Sicherheitssoftware- und Netzwerkmuster vergleichen; Incident ggf. eskalieren. |

**Vor dem Eingriff:** Kennwörter nicht anfordern; Anwender über mögliche Unterbrechungen informieren; bei Dateioperationen und Neustarts zunächst ungespeicherte Arbeit sichern; Sicherheitssoftware, Unternehmensdienste und Autostarts nicht eigenmächtig deaktivieren.

## 5. Diagnose-Entscheidungsbaum

![RB-007: Entscheidungsbaum der Windows-Performance-Diagnose](assets/rb007_diagnosebaum.svg)

**Textalternative:** 1. Problem und Ausmaß erfassen → 2. einen PC oder viele betroffene Geräte unterscheiden → 3. am betroffenen System CPU, RAM, Datenträger und Netzwerk während des Problems vergleichen → 4. je nach Auffälligkeit Prozess, Speicherbedarf, Laufwerk oder Netzwerkpfad untersuchen → 5. gezielte Maßnahme → 6. Vergleichstest und Dokumentation.

Der Baum ist ein **Leitfaden** und keine automatische Fehlerdiagnose. Mehrere Engpässe können gleichzeitig auftreten.

## 6. Erste Diagnose mit Windows-Bordmitteln (L1)

### A – Task-Manager starten

**Ausführungsort:** Betroffener Windows-PC in einer erlaubten Sitzung.  
**Starten:** `Strg + Umschalt + Esc` oder `taskmgr.exe`.

Untersuchen:

1. **Prozesse:** Nach **CPU**, **Arbeitsspeicher**, **Datenträger** sortieren. Welcher Prozess ist unter Last auffällig?
2. **Leistung:** Gesamtauslastung, Prozessorgeschwindigkeit, Speichernutzung, Laufwerksaktivität und Netzwerkauslastung betrachten.
3. **Autostart-Apps:** Prüfen, welche Programme beim Anmelden automatisch starten. Zunächst nur dokumentieren.
4. **Details:** Bei Bedarf einen Prozess anhand **PID** (*Process Identifier*, eindeutige Prozessnummer während seiner Laufzeit) zuordnen.

**Achtung:** Eine Prozessbezeichnung allein belegt noch nicht, ob der Prozess schädlich, unnötig oder fehlerhaft ist. Updates, Virenschutz, Datensicherung und Synchronisierung können vorübergehend legitim viel Leistung benötigen.

**Quelle:** [Microsoft Support – PC-Leistung und Task-Manager](https://support.microsoft.com/de-de/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows)

### B – Ressourcenmonitor

```powershell
# Öffnet die grafische Ressourcenüberwachung von Windows.
# Hier können CPU, Arbeitsspeicher, Datenträger und Netzwerk
# mit detaillierteren Prozessbezügen untersucht werden.
resmon.exe
```

Der **Ressourcenmonitor** hilft unter anderem dabei, Prozesse mit intensiven Datenträgerzugriffen zu erkennen. Eine **100-%-Aktivitätsanzeige** bedeutet nicht zwangsläufig, dass die maximale Übertragungsrate erreicht wird: Viele kleine oder langsame Operationen können den Datenträger lange beschäftigen.

### C – Zuverlässigkeitsverlauf

```powershell
# Startet den Windows-Zuverlässigkeitsmonitor.
# /rel wählt die Ansicht mit chronologischen Fehlern
# und Stabilitätsereignissen aus.
perfmon.exe /rel
```

Damit können Abstürze, Fehler und bestimmte Änderungen in zeitlichem Zusammenhang mit dem Beginn der Langsamkeit erkannt werden. Ein zeitlicher Zusammenhang beweist allein noch keine Ursache.

**Quelle:** [Microsoft Learn – perfmon-Befehlsoptionen](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/perfmon)

## 7. CPU-Diagnose mit PowerShell – richtige Interpretation

**Ausführungsort:** Betroffener Client, PowerShell im zulässigen Benutzer- oder Administrationskontext.  
**Art:** Lesende Diagnose; es werden keine Prozesse beendet.

### A – Prozesse mit hoher bisheriger CPU-Zeit anzeigen

```powershell
# Ruft die aktuell laufenden Prozesse ab.
Get-Process |

    # Sortiert nach CPU-Gesamtzeit absteigend.
    # WICHTIG: CPU ist hier die aufsummierte Prozessorzeit
    # in SEKUNDEN – nicht die momentane CPU-Auslastung in %.
    Sort-Object -Property CPU -Descending |

    # Gibt zehn Prozesse mit Prozessname, PID und CPU-Zeit aus.
    Select-Object -First 10 ProcessName, Id, CPU
```

**Interpretation:** Ein seit Tagen laufendes Programm kann viel CPU-Gesamtzeit gesammelt haben, obwohl es **jetzt gerade** fast keine CPU nutzt. Dieser Befehl ist eine Orientierung über die bisherige Laufzeit, kein Beweis für die aktuelle Last.

**Quelle:** [Microsoft Learn – Get-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process?view=powershell-5.1)

### B – Momentaufnahme der CPU-Gesamtauslastung

```powershell
# Fragt die Windows-CIM-Daten der Prozessoren ab.
# CIM bedeutet Common Information Model.
Get-CimInstance -ClassName Win32_Processor |

    # Zeigt Namen und ungefähre aktuelle Auslastung.
    # LoadPercentage ist ein Momentwert und kann schwanken.
    Select-Object Name, LoadPercentage
```

Bei mehreren CPU-Objekten können mehrere Zeilen erscheinen. Für belastbare Ergebnisse prüfen wir zusätzlich den Task-Manager **während des Problems** oder zeichnen eine Zeitreihe auf.

**Fehlerhypothese:** Wenn eine Hintergrundanwendung während des Symptoms dauerhaft hohe Last erzeugt, ihre Funktion nicht benötigt wird und die Last nach einer freigegebenen Änderung verschwindet, spricht das für eine verursachende Rolle. Hohe Last allein genügt dafür noch nicht.

## 8. RAM-Diagnose – physischer und verfügbarer Speicher

### A – Arbeitsspeicherbedarf nach Prozess

```powershell
# Ruft alle laufenden Prozesse ab.
Get-Process |

    # Sortiert nach physisch belegtem Arbeitsbereich (Working Set).
    Sort-Object -Property WorkingSet64 -Descending |

    # Zeigt die zehn Prozesse mit dem größten Working Set.
    Select-Object -First 10 ProcessName, Id,
        @{Name='WorkingSet_MiB'; Expression={
            # Wandelt die Byte-Angabe in MiB um und rundet.
            [math]::Round($_.WorkingSet64 / 1MB, 1)
        }}
```

**Working Set:** Menge an physischen Speicherseiten, die der Prozess derzeit zugeordnet hält. Dieser Wert ist **nicht identisch** mit exklusiv belegtem RAM; manche Seiten werden gemeinsam verwendet.

### B – Insgesamt und verfügbar

```powershell
# Liest Windows-Betriebssystemdaten über CIM aus.
$os = Get-CimInstance -ClassName Win32_OperatingSystem

# Erstellt eine Ausgabe mit Gesamt-RAM und freiem/verfügbarem RAM.
# Die ursprünglichen CIM-Eigenschaften haben die Einheit KiB.
# Division durch 1MB (= 1.048.576) ergibt näherungsweise GiB.
[PSCustomObject]@{
    RAM_gesamt_GiB  = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
    RAM_verfuegbar_GiB = [math]::Round($os.FreePhysicalMemory / 1MB, 1)
}
```

**Interpretation:** Wenig verfügbarer Speicher **zusammen mit** zähen Reaktionen und verstärkter Auslagerung ist ein Indiz für Speicherdruck. Eine hohe RAM-Auslastung ohne spürbare Probleme ist nicht automatisch reparaturbedürftig.

**Quelle:** [Microsoft Learn – Win32_OperatingSystem](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-operatingsystem)

## 9. Datenträgerdiagnose – Platz, Aktivität und Zustand

### A – Freier Speicherplatz auf Laufwerk C:

```powershell
# Liest die Eigenschaften des Volumes mit Laufwerkbuchstaben C.
Get-Volume -DriveLetter C |

    # Berechnet Gesamtgröße und verbleibenden Platz in GiB.
    Select-Object DriveLetter, FileSystem,
        @{Name='Gesamt_GiB'; Expression={[math]::Round($_.Size / 1GB, 1)}},
        @{Name='Frei_GiB'; Expression={[math]::Round($_.SizeRemaining / 1GB, 1)}}
```

**Interpretation:** Zu wenig Platz kann Updates, Auslagerung und temporäre Dateien beeinträchtigen. Ein voller Datenträger ist aber nicht die einzige mögliche Ursache für hohe Laufwerksauslastung. Nicht pauschal Benutzerdateien oder Systemverzeichnisse löschen.

### B – Gemeldeten Laufwerkszustand abfragen

```powershell
# Fragt von Windows erkannte physische Datenträger ab.
Get-PhysicalDisk |

    # Zeigt Bezeichnung, Medientyp und gemeldeten Zustand.
    Select-Object FriendlyName, MediaType, HealthStatus, OperationalStatus
```

**Grenze:** `HealthStatus = Healthy` ist kein vollständiger Hardwaretest und schließt einen bevorstehenden Defekt nicht sicher aus. Je nach Treiber, Controller, RAID oder virtueller Maschine sind Angaben unvollständig oder anders zu interpretieren.

**Quelle:** [Microsoft Learn – Get-PhysicalDisk](https://learn.microsoft.com/en-us/powershell/module/storage/get-physicaldisk?view=windowsserver2025-ps)

### C – Datenträgerauslastung genauer prüfen

**Task-Manager → Leistung → Datenträger**: Aktivitätszeit und Datenraten beobachten.  
**Ressourcenmonitor → Datenträger**: Verursachende Prozesse und Antwortzeiten prüfen.  
**L2:** Bei wiederkehrenden Engpässen gezielte Messungen mit Windows Performance Recorder (WPR) und Windows Performance Analyzer (WPA) durchführen.

**Quelle:** [Microsoft Learn – Ressourcenbasierte Leistungsaufzeichnungen](https://learn.microsoft.com/en-us/windows-hardware/test/wpt/recording-for-resource-based-analysis)

## 10. Ereignisanzeige – Treiber- und Systemfehler nicht übersehen

**Ausführungsort:** Betroffener Client; für bestimmte Protokolle sind administrative Leserechte erforderlich.

```powershell
# Legt fest, welche Systemereignisse untersucht werden.
$filter = @{
    # Das Systemprotokoll enthält Meldungen zu Windows und Treibern.
    LogName = 'System'

    # Level 2 = Fehler; Level 3 = Warnung.
    Level = 2, 3

    # Nur Ereignisse aus den vergangenen 48 Stunden.
    StartTime = (Get-Date).AddHours(-48)
}

# Liest höchstens 30 aktuelle Treffer und zeigt die Basisdaten.
Get-WinEvent -FilterHashtable $filter -MaxEvents 30 |
    Select-Object TimeCreated, ProviderName, Id, LevelDisplayName, Message
```

**Interpretation:** Überprüfen, ob die Ereignisse zeitlich mit der Störung zusammenfallen. Einzelne Warnungen können völlig unabhängig sein. Speichercontroller- oder Datenträgerfehler, wenn vorhanden, sind wichtige Hinweise auf mögliche Hardware-/Treiberprobleme.

Weitere grafische Prüfung: `eventvwr.msc` → **Windows-Protokolle → System**. Bei nur einer langsamen Anwendung auch **Windows-Protokolle → Anwendung** und die zugehörigen Produktprotokolle prüfen.

## 11. Autostart, Hintergrundaufgaben und Energieeinstellungen

### A – Autostart prüfen

**Task-Manager → Autostart-Apps:** Eintrag, Status, Hersteller, Startauswirkung dokumentieren. Einen möglicherweise unnötigen Autostarteintrag **nur nach Prüfung und Freigabe** deaktivieren; Sicherheitsagenten, VPN, Backup-Software und Verwaltungswerkzeuge sind nicht beliebig austauschbare „Tuning-Programme“.

**L2-Werkzeug:** **Autoruns** aus Microsoft Sysinternals zeigt deutlich mehr Autostartpositionen als der Task-Manager, einschließlich Diensten, geplanten Aufgaben und Registry-Einträgen. Es eignet sich zuerst zur **Analyse**; Änderungen erfordern Abstimmung.

### B – Prozesszusammenhänge verstehen

**Process Explorer** (Microsoft Sysinternals) zeigt Prozesshierarchien, Handles und geladene Module. Das hilft, den Besitzer eines Prozesses oder seine Abhängigkeiten zu untersuchen.

**Quellen:** [Microsoft Support – Startanwendungen konfigurieren](https://support.microsoft.com/de-de/windows/experience/startup-boot/configure-startup-applications-in-windows) · [Microsoft Learn – Autoruns](https://learn.microsoft.com/de-de/sysinternals/downloads/autoruns) · [Microsoft Learn – Process Explorer](https://learn.microsoft.com/de-de/sysinternals/downloads/process-explorer)

### C – Hardware, Energie und Temperatur

Bei Laptopproblemen prüfen wir Netzteil, Energiemodus, Akkubetrieb, Lüfterverhalten, Temperatur und Herstellerdiagnose. Hitze oder aggressive Energiesparvorgaben können die CPU-Leistung begrenzen. **Nicht** pauschal „Höchstleistung“ erzwingen: Mehr Wärme, Stromverbrauch und weniger Laufzeit können die Folge sein.

## 12. Wenn der PC nur zeitweise langsam ist – Zeitmessungen (L2)

Ein einzelner Task-Manager-Screenshot kann den Fehler verpassen. Microsoft beschreibt für solche Fälle **Leistungsmonitor (perfmon)** und Messungen über einen längeren Zeitraum. Bei komplexen Situationen können **WPR/WPA** CPU-, Datenträger-, Netzwerk- und andere Leistungsaktivitäten genauer erfassen.

**Vorgehen:** Problem reproduzieren → Start- und Endzeit festhalten → passende Zähler/Traces aufzeichnen → Ereignisse mit dem Symptom korrelieren → sensible Trace-Dateien geschützt speichern → Ergebnisse beurteilen.

**Wichtig:** Leistungsaufzeichnungen können Prozessnamen, Dateipfade und weitere betriebliche Informationen enthalten. Nur nach Freigabe sammeln und intern sicher aufbewahren.

**Quellen:** [Microsoft Learn – Leistungsmonitor zur Problembehandlung](https://learn.microsoft.com/de-de/troubleshoot/windows-server/support-tools/troubleshoot-issues-performance-monitor) · [Microsoft Learn – Windows Performance Recorder](https://learn.microsoft.com/en-us/windows-hardware/test/wpt/introduction-to-wpr)

## 13. Maßnahmen nach Befund – was ist sinnvoll, was riskant?

| Ermittelte Auffälligkeit | Gezielte Maßnahme | Wichtige Einschränkung |
|---|---|---|
| Nicht benötigtes Programm verursacht dauerhafte Last | Zweck und Verantwortliche klären; nach Freigabe Autostart oder geplante Aufgabe anpassen | Nicht blind Dienste/Prozesse stoppen |
| RAM reicht bei üblichen Arbeitsaufgaben nicht aus | Prozess-/Browserlast reduzieren oder Hardwarebedarf begründen | Mehr RAM nur nach tatsächlichem Engpass empfehlen |
| Datenträger fast voll | Nach Freigabe nicht benötigte Dateien/temporäre Inhalte über vorgesehene Werkzeuge bereinigen | Keine Benutzer- oder Systemdaten wahllos löschen |
| Datenträgerauffälligkeiten oder wiederkehrende Fehler | Datensicherung und Hardwarediagnose priorisieren, Hardwareteam eskalieren | „Healthy“ schließt Defekte nicht sicher aus |
| Update, Treiber oder Anwendung korreliert mit Beginn | Versionsstand, bekannte Probleme, Herstellerempfehlungen prüfen | Kein pauschales Rollback ohne Risikoprüfung |
| Gerät wird unter Dauerlast heiß | Kühlung, Lüfter, Netzteil und Energiemodus überprüfen | Kein unkontrolliertes Leistungs-/Temperaturlimit entfernen |
| Nur Unternehmensanwendungen träge | Lokale App gegen Web/Netzwerk/Server testen | Keine unnötige Windows-Neuinstallation |
| Mehrere Geräte gleichzeitig langsam | Gemeinsame Ursache im Management/Netzwerk prüfen | Zentral als Störung einstufen und eskalieren |

**Keine Standardlösung:** Registry-„Cleaner“, pauschales Löschen von Prefetch, beliebiges Beenden von Diensten, Abschalten von Defender/EDR (*Endpoint Detection and Response*: Endpoint-Sicherheitsüberwachung), pauschales Deaktivieren von Updates oder Reparaturbefehle ohne Befund.

## 14. Erfolgskontrolle, Ticketabschluss und Eskalation

### Wiederholbarer Funktionstest

1. Dieselbe Benutzeraktion wie zu Beginn ausführen (z. B. Teams öffnen und zwei Dateien laden).
2. Bedingungen möglichst vergleichbar halten (gleicher Netztyp, Akku/Netzteil, ähnliche Hintergrundlast).
3. Zeit und beobachtete CPU-/RAM-/Datenträgerwerte **vor und nach** der Maßnahme vergleichen.
4. Prüfen, ob zentrale Anwendungen, Sicherheitsschutz und Synchronisierung weiterhin funktionieren.
5. Erkenntnisse und Restunsicherheiten dokumentieren.

### Wann ist L2 nötig?

- Wiederkehrende Störungen ohne eindeutigen Verursacher
- Auffällige Treiber-/Datenträgerereignisse oder drohender Defekt
- Zentral verwaltete Dienste, Update-Richtlinien oder Sicherheitssoftware betroffen
- Notwendigkeit von WPR/WPA-Traces, Herstellerdiagnose oder Infrastrukturänderungen
- Mehrere Geräte/Benutzer betroffen

### Fiktiver Muster-Ticketkommentar

> **INC-007 – Laptop seit Anmeldung deutlich langsam**  
> **Fehlerbild:** Nach der Windows-Anmeldung reagierten mehrere Anwendungen für einige Minuten verzögert.  
> **Diagnose:** Task-Manager und Ressourcenmonitor während der Verzögerung geprüft. Ein genehmigter Synchronisierungsauftrag verursachte zeitgleich hohe CPU- und Datenträgeraktivität. Weitere Systemfehler waren im untersuchten Zeitraum nicht auffällig.  
> **Ursache:** Zeitgleich ausgeführter Hintergrundauftrag mit hohem Ressourcenbedarf.  
> **Maßnahme:** Nach Freigabe Startzeit des Auftrags auf ein geeignetes Zeitfenster geändert; Schutz- und Sicherungsfunktion blieb bestehen.  
> **Erfolgskontrolle:** Gleiche Benutzeraktionen bei einer erneuten Anmeldung geprüft; Verzögerung nicht erneut beobachtet.  
> **Status:** Gelöst.  
> *Das gesamte Beispiel ist konstruiert; Messungen wurden nicht tatsächlich durchgeführt.*

## 15. Lernkontrolle, Validierung und Quellen

### Verständnis- und Diagnosefragen

1. Warum beweist der PowerShell-Wert `CPU` eines Prozesses nicht seine aktuelle CPU-Auslastung?
2. Was unterscheidet RAM-Auslastung von verfügbarem Arbeitsspeicher?
3. Warum kann eine Datenträgeranzeige von 100 % nicht automatisch mit einer maximalen Datenrate gleichgesetzt werden?
4. Was sagt `HealthStatus = Healthy` aus – und was nicht?
5. Warum kann ein zeitlich passender Ereignisprotokolleintrag trotzdem eine falsche Spur sein?
6. Wie unterscheidest du einen langsamen PC von einer langsamen Netzwerkanwendung?
7. Warum darfst du einen Unternehmens-Sicherheitsagenten nicht ohne Freigabe deaktivieren?

### Eigenständige Diagnoseaufgabe

> Ein Windows-11-Laptop ist täglich zwischen 08:45 und 09:10 Uhr langsam. Ab 09:15 Uhr läuft er normal. Die CPU erreicht teilweise 90 %, gleichzeitig ist die Datenträgeraktivität hoch. Zwei Kollegen mit demselben Laptopmodell sind nicht betroffen. Formuliere **drei mögliche Ursachen**, **zwei geeignete Messungen** und **eine Prüfung, die du bewusst nicht als Erstes ausführst**.

### Technische Referenzen

- [Microsoft Support – Tipps zur PC-Leistung in Windows](https://support.microsoft.com/de-de/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows)
- [Microsoft Support – Startanwendungen in Windows](https://support.microsoft.com/de-de/windows/experience/startup-boot/configure-startup-applications-in-windows)
- [Microsoft Learn – Get-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process?view=powershell-5.1)
- [Microsoft Learn – Win32_OperatingSystem](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-operatingsystem)
- [Microsoft Learn – Get-PhysicalDisk](https://learn.microsoft.com/en-us/powershell/module/storage/get-physicaldisk?view=windowsserver2025-ps)
- [Microsoft Learn – perfmon](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/perfmon)
- [Microsoft Learn – Performance Monitor und Leistungsmessung](https://learn.microsoft.com/de-de/troubleshoot/windows-server/support-tools/troubleshoot-issues-performance-monitor)
- [Microsoft Learn – Windows Performance Recorder](https://learn.microsoft.com/en-us/windows-hardware/test/wpt/introduction-to-wpr)
- [Microsoft Learn – Process Explorer](https://learn.microsoft.com/de-de/sysinternals/downloads/process-explorer)
- [Microsoft Learn – Autoruns](https://learn.microsoft.com/de-de/sysinternals/downloads/autoruns)

**Validierungsstatus:** Fachlich recherchiert, noch nicht durch eigene Benchmarks oder Tests am realen Windows-System nachgewiesen. Bei praktischen Tests werden Umgebung, Vorher-/Nachher-Werte und Abweichungen nachgetragen.

**Praxis-Runbook:** [RB-007 – Kompakte Diagnosecheckliste](RB-007_Praxis-Runbook.md)
