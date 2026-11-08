# RB-007 – Praxis-Runbook: Windows-PC ungewöhnlich langsam

**Zweck:** Kompakte, wiederverwendbare Diagnosecheckliste für den 1st-/2nd-Level-Support  
**Version:** 1.0 · **Stand:** 08.11.2026 · **Status:** Recherchiert, nicht praktisch validiert  
**Geltungsbereich:** Windows-11-Clients. Vorgehensweise an Unternehmensrichtlinien und Geräteverwaltung anpassen.

## 1. Ticket erfassen (L1)

- [ ] **Symptom:** Ganzer PC oder nur eine Anwendung? Starten, Öffnen, Speichern, Netzwerk?
- [ ] **Zeitpunkt:** Seit wann; permanent oder nur zu bestimmten Uhrzeiten?
- [ ] **Ausmaß:** Ein Gerät oder mehrere? Derselbe Benutzer auch auf anderen Geräten betroffen?
- [ ] **Änderung:** Updates, neue Programme, Treiber, geänderte Energieeinstellungen?
- [ ] **Umgebung:** Netzteil/Akku, WLAN/LAN, Gerät heiß, freie Laufwerkskapazität?
- [ ] **Messbares Beispiel:** Welche Aktion dauert wie lange? Messung möglichst reproduzierbar dokumentieren.
- [ ] **Zugang:** Benutzergeführte Bildschirmfreigabe, freigegebene Fernwartung, RDP, WinRM oder vor Ort?

## 2. Engpass während des Problems lokalisieren (L1)

**Auf dem betroffenen Client:** `Strg + Umschalt + Esc` → Task-Manager → **Prozesse** und **Leistung**.

| Auffälligkeit | Nächste Prüfung |
|---|---|
| CPU während des Symptoms langfristig hoch | Nach momentaner CPU sortieren; Prozess, Hersteller, Aufgabe und zeitlichen Zusammenhang prüfen. |
| Wenig verfügbarer RAM + Verzögerungen | Speicherbedarf nach Prozessen; Auslagerungsaktivität und tatsächliche Arbeitslast vergleichen. |
| Datenträger lange hoch ausgelastet | `resmon.exe` → Datenträger: aktive Prozesse, Zugriffe und Antwortzeiten. |
| Lokal alles schnell, nur Web/Netzlaufwerke langsam | Netzwerk/VPN, DNS, Zielserver, Proxy prüfen; gegebenenfalls zu Netzwerk-/App-Runbook wechseln. |
| Nur nach Anmeldung langsam | Autostart-Apps, geplante Aufgaben, Unternehmensagenten/Updates prüfen. |
| Hänger/Absturz nach Update | `perfmon.exe /rel`, Ereignisanzeige und Änderungszeitpunkt abgleichen. |
| Überhitzung/Hardwarewarnung | Hardwarezustand und Datensicherung priorisieren; bei Defektverdacht eskalieren. |

**Abkürzungen:** CPU = Central Processing Unit (Prozessor); RAM = Random Access Memory (Arbeitsspeicher); SSD/HDD = Datenträgertypen; VPN = Virtual Private Network (geschützte Netzwerkverbindung); WinRM = Windows Remote Management; RDP = Remote Desktop Protocol.

## 3. Lesende Diagnosebefehle

**Auf dem betroffenen Client** in PowerShell ausführen (sofern Unternehmensrichtlinien dies erlauben):

```powershell
# Öffnet den Ressourcenmonitor (grafische Windows-Oberfläche).
resmon.exe

# Öffnet den Zuverlässigkeitsverlauf zur Prüfung früherer Fehler.
perfmon.exe /rel

# Listet die zehn Prozesse mit der höchsten GESAMTEN CPU-Zeit.
# ACHTUNG: CPU bedeutet hier Sekunden über die Laufzeit,
# NICHT aktuelle CPU-Prozent!
Get-Process | Sort-Object CPU -Descending |
    Select-Object -First 10 ProcessName, Id, CPU

# Liest RAM-Werte über CIM (Common Information Model).
$os = Get-CimInstance -ClassName Win32_OperatingSystem

# Zeigt Gesamt-RAM und verfügbaren RAM in GiB an.
# Rohwerte sind in KiB angegeben; daher durch 1MB teilen.
[PSCustomObject]@{
    Gesamt_GiB    = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
    Verfuegbar_GiB = [math]::Round($os.FreePhysicalMemory / 1MB, 1)
}

# Zeigt Gesamtkapazität und freien Platz auf Laufwerk C:.
Get-Volume -DriveLetter C |
    Select-Object DriveLetter,
        @{Name='Frei_GiB';Expression={[math]::Round($_.SizeRemaining / 1GB,1)}},
        @{Name='Gesamt_GiB';Expression={[math]::Round($_.Size / 1GB,1)}}

# Zeigt den von Windows gemeldeten Datenträgerzustand.
# 'Healthy' garantiert keinen defektfreien Datenträger.
Get-PhysicalDisk | Select-Object FriendlyName,MediaType,HealthStatus
```

**Achtung zur Interpretation:** `Get-Process ... CPU` ist keine aktuelle Prozentmessung. Für aktuelle CPU-Auslastung während der Störung im Task-Manager nach **CPU** sortieren. Auch ein „Healthy“-Laufwerk kann einen bislang unentdeckten Fehler haben.

## 4. Ereignisse prüfen (L1/L2)

```powershell
# Filter: Windows-Systemprotokoll, Warnungen/Fehler,
# Ereignisse der letzten 48 Stunden.
$filter = @{
    LogName   = 'System'
    Level     = 2, 3
    StartTime = (Get-Date).AddHours(-48)
}

# Liest bis zu 30 passende Ereignisse zur zeitlichen Korrelation.
Get-WinEvent -FilterHashtable $filter -MaxEvents 30 |
    Select-Object TimeCreated,ProviderName,Id,Message
```

- [ ] Zeitpunkt mit dem tatsächlichen Leistungseinbruch abgleichen.
- [ ] Hersteller-/Treiber-/Datenträgermeldungen nicht ohne Prüfung als Ursache behaupten.
- [ ] Bei nur einer langsamen Anwendung zusätzlich das **Anwendungsprotokoll** prüfen.

## 5. Befund → gezielte Maßnahme

| Befund | Vorgehen |
|---|---|
| Nachgewiesene Last durch nicht benötigten Autostart | Verantwortung klären, nach Freigabe Startverhalten ändern; erneut messen. |
| Relevanter RAM-Engpass | Arbeitsspeicherbedarf reduzieren oder Aufrüstbedarf fachlich begründen. |
| Kaum freier Speicherplatz | Freigegebene Bereinigung mit Windows-Bordmitteln; Daten schützen. |
| Problem seit bestimmtem Update | Versionen und Herstellerhinweise prüfen; Rollback nur nach Freigabe/Risikobewertung. |
| Laufwerksfehler, unklare Hardware | Datensicherung und Hardwareteam priorisieren; nicht mit „Cleanup“ überdecken. |
| CPU/Disk normal, nur Netz-Anwendungen langsam | Zielsystem/Netzwerk statt lokale Hardware untersuchen. |
| Mehrere Clients betroffen | Zentralen Vorfall aufnehmen und L2 / IT-Betrieb einschalten. |

**Nicht pauschal:** Prozesse zwangsweise beenden, Defender/EDR/VPN/Backup-Agenten abschalten, Registry-„Cleaner“ einsetzen, Auslagerungsdatei deaktivieren oder beliebige Systemdateien löschen.

## 6. Erfolgskontrolle

- [ ] Gleiche zuvor langsame Benutzeraktion wiederholt.
- [ ] Zeiten und Ressourcenwerte **vorher/nachher** unter vergleichbaren Bedingungen erfasst.
- [ ] Notwendige Sicherheit-, Synchronisations- und Verwaltungsfunktionen arbeiten weiterhin.
- [ ] Kein erneuter Leistungseinbruch im beobachteten Zeitfenster.
- [ ] Ursache, Maßnahmen, Ergebnis und verbliebene Unsicherheit im Ticket dokumentiert.

## 7. Wann L2 hinzuziehen?

Unklare wiederkehrende Engpässe, Hardware-/Treiberfehler, Sicherheitsagenten, zentrale Richtlinien, mehrere Geräte oder notwendige Langzeitmessungen via **WPR (Windows Performance Recorder)** / **WPA (Windows Performance Analyzer)**.

## 8. Muster-Ticketabschluss (fiktiv)

> **INC-007:** Langsame Reaktion nach Windows-Anmeldung an `PC-023`. In Task-Manager und Ressourcenmonitor zeitgleiche erhöhte CPU- und Datenträgerlast durch einen freigegebenen Hintergrundauftrag festgestellt. Nach Rücksprache Ausführungszeitpunkt organisatorisch angepasst. Dieselbe Benutzeraktion beim Folgetest ohne Verzögerung ausgeführt. Keine Sicherheitsdienste abgeschaltet. **Status: gelöst.**  
> *Fiktives Beispiel; keine reale Messung oder Änderung behauptet.*

## 9. Technische Quellen

- [Microsoft Support: Tipps zur PC-Leistung](https://support.microsoft.com/de-de/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows)
- [Microsoft Support: Autostart-Apps](https://support.microsoft.com/de-de/windows/experience/startup-boot/configure-startup-applications-in-windows)
- [Microsoft Learn: Get-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process?view=powershell-5.1)
- [Microsoft Learn: Win32_OperatingSystem](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-operatingsystem)
- [Microsoft Learn: Get-PhysicalDisk](https://learn.microsoft.com/en-us/powershell/module/storage/get-physicaldisk?view=windowsserver2025-ps)
- [Microsoft Learn: Performance Monitor](https://learn.microsoft.com/de-de/troubleshoot/windows-server/support-tools/troubleshoot-issues-performance-monitor)
- [Microsoft Learn: WPR](https://learn.microsoft.com/en-us/windows-hardware/test/wpt/introduction-to-wpr)

**Ausführlicher Lernartikel:** [RB-007 – Windows-Performance verstehen und diagnostizieren](RB-007_Lernartikel.md)
