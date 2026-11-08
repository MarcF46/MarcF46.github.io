# RB-005 – Zugriff auf Datei oder Ordner verweigert

> **50 Tickets – 50 typische Supportfälle**  
> **Ticket:** INC-005 · **Support-Level:** L1/L2 · **System:** Windows 11, Windows Server, AD DS, SMB/NTFS  
> **Stand:** 08.11.2026 · **Version:** 1.1  
> **Validierungsstatus:** Anhand von Microsoft-Dokumentation recherchiert; sämtliche Beispielausgaben und das Musterticket sind fiktiv. Keine praktische Validierung dieses Falls behauptet.

![RB-005: Zugriff auf Datei oder Ordner verweigert – Zwei-Schranken-Prinzip](assets/rb005_zugriff_verweigert_infografik.png)

## 1. Ausgangssituation und Ziel

**Fiktives Supportticket INC-005**

> „Ich bekomme beim Öffnen unseres Einkaufsordners die Meldung ›Zugriff verweigert‹. Meine Kollegin kann ihn öffnen. Seit letzter Woche bin ich auch im Einkaufsteam.“

**Beispielumgebung:** Der Arbeitsplatz heißt `PC-023`, der Fileserver `FS01`. Die Freigabe `\\FS01\Projekte` verweist auf das lokale Serververzeichnis `D:\Freigaben\Projekte`. Innerhalb dieser Freigabe liegt der Ordner `Einkauf`. Der Benutzer heißt `FIRMA\a.meyer`. Alle Namen sind erfunden.

**Ziel:** Herausfinden, ob der Fehler bei der Netzwerkverbindung, der SMB-Anmeldung, den Freigaberechten, den NTFS-Rechten oder dem aktuellen Benutzertoken liegt. Nur notwendige Rechte gemäß Freigabe erteilen und mit dem betroffenen Konto testen.

**Leitsatz:** **Zugriff verweigert** ist eine Fehlermeldung, keine vollständig identifizierte Ursache. Insbesondere nicht sofort `Jeder: Vollzugriff` vergeben.

## 2. Technische Grundlagen und Abkürzungen

| Begriff | Bedeutung für Einsteiger |
|---|---|
| **ACL (Access Control List)** | Zugriffskontrollliste mit Regeln für Benutzer und Gruppen. |
| **ACE (Access Control Entry)** | Einzelner Berechtigungseintrag in einer ACL. |
| **DACL (Discretionary Access Control List)** | Liste der *erlaubenden und verweigernden* Zugriffsregeln auf eine Ressource. |
| **NTFS (New Technology File System)** | Windows-Dateisystem mit differenzierten Rechten für Dateien und Ordner. |
| **SMB (Server Message Block)** | Netzwerkprotokoll zum Zugriff auf Freigaben; verwendet typischerweise TCP-Port 445. |
| **UNC (Universal Naming Convention)** | Netzwerkpfad im Format `\\Server\Freigabe\Unterordner`. |
| **AD DS (Active Directory Domain Services)** | Microsoft-Domänendienst mit Benutzer-, Computer- und Gruppenobjekten. |
| **SID (Security Identifier)** | Windows-interne Kennung für Sicherheitsprinzipale wie Benutzer und Gruppen. |
| **Token / Zugriffstoken** | Vom Betriebssystem für eine Anmeldung erzeugter Sicherheitskontext mit Gruppenkennungen und Rechten. |
| **Kerberos** | Bevorzugtes Ticket-basiertes Authentifizierungsprotokoll in der klassischen AD-Domäne. |
| **NTLM (NT LAN Manager)** | Älteres Challenge-Response-Authentifizierungsverfahren, unter Umständen noch in Verwendung. |
| **DNS (Domain Name System)** | Übersetzt beispielsweise `FS01` in eine IP-Adresse. |
| **RSAT (Remote Server Administration Tools)** | Werkzeuge, um etwa AD-Daten vom Administrations-PC aus zu prüfen. |
| **RDP (Remote Desktop Protocol)** | Grafische Remoteanmeldung in einer eigenen Sitzung. |
| **WinRM (Windows Remote Management)** | Windows-Verwaltungsschnittstelle für Remote-Befehle, z. B. PowerShell-Remoting. |
| **L1 / L2** | First-Level: Erstdiagnose/Standardmaßnahmen; Second-Level: erweiterte Berechtigungs- und Serveranalyse. |

### Was bedeutet „Berechtigung“?

Ein Benutzer braucht nicht zwangsläufig **Vollzugriff**, sondern nur die Operationen, die seine Arbeit erfordert: Ordnerinhalt auflisten, Dateien **lesen**, **schreiben**, **ändern** oder **löschen**. „Lesen“ und „Ändern“ sind unterschiedliche Rechte. Das Prinzip des **Least Privilege** (geringstmögliche Berechtigung) hilft, unbeabsichtigte Änderungen und Datenabfluss zu verhindern.

### Zwei Schranken beim Zugriff über das Netzwerk

Bei einem SMB-Zugriff auf einen NTFS-Ordner wirken gewöhnlich **Freigabeberechtigungen** und **NTFS-Berechtigungen** zusammen:

```text
Windows-Client (Benutzer FIRMA\a.meyer)
          │
          ▼
\\FS01\Projekte\Einkauf
          │
          ├── 1. Freigabeberechtigungen auf „Projekte"
          │         Dürfte das Konto über die Freigabe lesen/ändern?
          ▼
          └── 2. NTFS-Berechtigungen auf D:\Freigaben\Projekte\Einkauf
                    Dürfte das Konto diese Datei/den Ordner lesen/ändern?
                              │
                              ▼
                   Nur erlaubte Operationen möglich
```

**Beispiel:** Die Freigabe erlaubt **Lesen**, NTFS erlaubt **Ändern**. Über genau diese SMB-Freigabe kann ein regulärer Benutzer trotzdem nicht ändern, weil die Freigabe das einschränkt. Bei lokalem Zugriff auf das Verzeichnis ist dagegen nicht die Netzwerkfreigabeberechtigung entscheidend, sondern insbesondere die Dateisystemsicherheit. Weitere Mechanismen wie zentrale Zugriffsrichtlinien können ebenfalls einschränken.

**Quelle:** [Microsoft Learn – Freigabe- und NTFS-Berechtigungen](https://learn.microsoft.com/de-de/iis/web-hosting/configuring-servers-in-the-windows-web-platform/configuring-share-and-ntfs-permissions)

### Grundlagen-Vertiefung: Verweigerung, Vererbung und GPO

![Zwei-Schranken-Prinzip im Henne-Ei-Stil mit Vererbung und GPO](assets/rb005_zwei_schranken_henne_ei.png)

**Merksatz:** Beim Netzwerkzugriff begrenzt die **restriktivere (strengere, stärker einschränkende)** der beiden Berechtigungsebenen, welche Operation möglich ist. Innerhalb von NTFS spielen außerdem ausdrücklich verweigerte Rechte (`Deny`), geerbte Regeln, Gruppen und weitere Sicherheitsmechanismen eine Rolle.

Die detaillierte, einsteigerfreundliche Erklärung einschließlich **Deny vs. Allow**, **Vererbung**, **Access-Based Enumeration (ABE)**, **EFS-Dateiverschlüsselung**, **zentrale Zugriffsrichtlinien**, **GPO-Laufwerkszuordnung** und kommentierter PowerShell-Beispiele steht in einer eigenständigen Ergänzung:

➡️ **[Grundlagen: Netzwerkfreigabe, NTFS, Verweigerung, Vererbung und GPO](RB-005_Grundlagen_Freigabe-und-NTFS.md)**

*Infografik: Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Sie vereinfacht die tatsächliche Zugriffskontrolle; insbesondere ist die GPO-Laufwerkszuordnung keine Berechtigungsvergabe.*

---

## 3. Häufige Fehlerbilder voneinander unterscheiden

| Meldung/Symptom | Möglicher Hintergrund | Erste sinnvolle Prüfung |
|---|---|---|
| „Zugriff verweigert“ beim Öffnen eines Unterordners | NTFS-Recht, Freigaberecht, Token, Anmeldeidentität | Pfad/Benutzer/gewünschte Operation genau bestimmen |
| Freigabe ist überhaupt nicht erreichbar | DNS, Netzwerk, Firewall, SMB-Dienst oder Richtlinie | Namenauflösung und TCP 445 prüfen |
| Ordner lässt sich öffnen, Datei aber nicht bearbeiten | Schreib-/Änderungsrecht fehlt oder Datei ist gesperrt | Lesen vs. Schreiben abgrenzen; Datei-/Ordnerrechte prüfen |
| Nur ein Mitarbeiter ist betroffen | Benutzer-/Gruppenzuordnung oder Sitzung | Konto und Token vergleichen |
| Nach Gruppenänderung weiterhin kein Zugriff | Alte Anmeldung/alter Token oder alte SMB-Sitzung | AD-Gruppen und `whoami /groups` im betroffenen Kontext vergleichen |
| Windows meldet, dass Gastzugriff durch Richtlinie blockiert ist | SMB-Sicherheitsanforderungen | Nicht Gastzugriff oder SMB1 pauschal aktivieren |

**Wichtig:** `0x80070035` („Netzwerkpfad nicht gefunden“) ist ein anderer Befund als ein nachweislicher NTFS-Zugriffsfehler. Microsoft dokumentiert bei neueren Windows-Versionen zusätzliche SMB-Sicherheitsanforderungen. [Quelle – SMB: Access denied](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/access-denied-access-smb-file-share)

## 4. Erstaufnahme und Zugriffsmöglichkeiten

Vor dem ersten Befehl werden folgende Informationen erfasst:

1. **Exakter Netzwerkpfad:** z. B. `\\FS01\Projekte\Einkauf` (nicht nur „Laufwerk P:“).
2. **Was scheitert konkret?** Ordner öffnen, Datei lesen, speichern, löschen oder umbenennen?
3. **Wer ist betroffen?** Ein Benutzer, mehrere Benutzer, alle Standorte?
4. **Seit wann?** Seit Teamwechsel, Gruppenänderung, Update, VPN-Wechsel?
5. **Unter welchem Konto?** Richtige Windows-Anmeldung oder zwischengespeicherte andere Zugangsdaten?
6. **Welche Berechtigung ist fachlich freigegeben?** Abteilungs-/Datenverantwortliche entscheiden; der Support setzt nicht eigenmächtig höhere Rechte.

### Typische Zugriffssituationen

| Situation | Zugriffsweg | Konkrete Tätigkeit |
|---|---|---|
| Benutzer ist angemeldet | Teams-Bildschirmfreigabe oder freigegebene Fernsteuerung | Fehlermeldung, Netzwerkpfad und Benutzerkontext gemeinsam prüfen; Benutzer anleiten. |
| Benutzer nicht vor Ort, PC für IT erreichbar | Autorisierte RDP-/WinRM-Verwaltung | Clientbezogene Informationen erheben; **RDP nutzt eine eigene Sitzung**, nicht automatisch die Sitzung des Benutzers. |
| Fileserver erreichbar und Berechtigung zum Lesen der Konfiguration | Administrationswerkzeuge / PowerShell auf `FS01` | SMB-Freigabe und NTFS-ACLs lesen. |
| AD-Gruppen prüfen | RSAT auf Administrationsrechner | AD-Gruppenmitgliedschaft des Benutzerkontos untersuchen. |
| Client/Server nicht erreichbar | Telefonische oder Vor-Ort-Diagnose | Verbindung, VPN, Zielname und Status abklären. |

**Wesentliche Unterscheidung:** `whoami /groups` zeigt die Gruppen im **aktuellen Zugriffstoken der ausführenden Sitzung**. Wenn der Support den Befehl über sein eigenes Administratorkonto ausführt, untersucht er damit **nicht** das Token des betroffenen Benutzers. Dafür muss der Befehl im Kontext von `FIRMA\a.meyer` ausgeführt werden.

## 5. Diagnose-Entscheidungsbaum

![RB-005 – Diagnose-Entscheidungsbaum](assets/rb005_diagnosebaum.svg)

**Textalternative:**

1. Ist nur ein Benutzer betroffen? **Ja:** Identität, Gruppenmitgliedschaft und aktuellen Token prüfen. **Nein:** gemeinsame Freigabe-/Server-/Netzänderungen untersuchen.
2. Ist `FS01` auf TCP 445 erreichbar? **Nein:** DNS, VPN, Routing, Firewall und SMB-Dienst prüfen. **Ja:** Verbindung ist nur auf Transportebene möglich; weiter mit Authentifizierung und Freigabe.
3. Ist `\\FS01\Projekte` grundsätzlich zugänglich? **Nein:** Identität, SMB-Authentifizierung, Share ACL und Richtlinien prüfen. **Ja:** spezifischen Unterordner und gewünschte Aktion testen.
4. Sind Freigabe- **und** NTFS-Rechte ausreichend? **Nein:** freigegebene Soll-Berechtigungen gezielt anpassen lassen. **Ja:** Token, Vererbung, explizite Deny-Einträge, weitere Richtlinien und Dateisperren prüfen.
5. Erfolgreiche Korrektur → **mit dem betroffenen Konto** exakt die ursprüngliche Aktion testen und Ticket dokumentieren.

## 6. Diagnose A – Netzwerk/SMB von Zugriffsrechten unterscheiden

**Ausführungsort:** Betroffener Windows-Client oder im Benutzerkontext autorisierte Fernwartung.

```powershell
# Prüft, ob der Fileserver FS01 über den üblichen SMB-TCP-Port
# 445 erreichbar ist. Die Anmelderechte werden dabei NICHT geprüft.
Test-NetConnection -ComputerName 'FS01' -Port 445
```

- `TcpTestSucceeded = True`: TCP-Port 445 ist erreichbar. Es ist **noch nicht** bewiesen, dass der Benutzer die Freigabe öffnen darf.
- `TcpTestSucceeded = False`: DNS, Routing, VPN, Firewall, Serverdienst oder Verfügbarkeit können die Ursache sein.

Weitere Prüfung:

```powershell
# Zeigt den Namen des angemeldeten Kontos in dieser Sitzung.
whoami

# Zeigt vorhandene SMB-Laufwerkszuordnungen des ausführenden Benutzers.
Get-SmbMapping | Select-Object LocalPath, RemotePath, Status
```

**Hinweis:** Ein fehlendes Netzlaufwerk ist nicht gleichbedeutend mit fehlenden Dateiberechtigungen. Statt eines Laufwerksbuchstabens kann ein UNC-Pfad direkt getestet werden. `Test-Path` allein trennt „Pfad existiert nicht“ und „Zugriff verweigert“ nicht zuverlässig.

## 7. Diagnose B – Berechtigungen der SMB-Freigabe lesen

**Ausführungsort:** **Fileserver `FS01`**, in einer berechtigten Administrationssitzung. `Get-SmbShareAccess` wird nicht einfach auf einem beliebigen Client ausgeführt und zeigt dann automatisch den entfernten Server an.

```powershell
# Sucht die SMB-Freigabe mit dem Namen „Projekte“ auf diesem Server.
# Path gibt den lokalen Pfad an, auf den die Freigabe verweist.
Get-SmbShare -Name 'Projekte' | Select-Object Name, Path

# Liest die Zugriffsregeln der Freigabe „Projekte“ aus.
# AccountName benennt Benutzer/Gruppen; AccessRight das Recht.
# AccessControlType unterscheidet Allow und Deny.
Get-SmbShareAccess -Name 'Projekte' |
    Select-Object Name, AccountName, AccessControlType, AccessRight
```

**Beispielausgabe (fiktiv):**

```text
Name      AccountName                  AccessControlType AccessRight
----      -----------                  ----------------- -----------
Projekte  FIRMA\DL_FS01_Projekte_RW     Allow             Change
Projekte  FIRMA\DL_FS01_Projekte_Read   Allow             Read
```

Dies sind nur **Freigaberechte**. Sie beweisen weder vollständige NTFS-Rechte noch, dass die Gruppen im aktuellen Benutzertoken enthalten sind.

**Quelle:** [Microsoft Learn – Get-SmbShareAccess](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbshareaccess)

## 8. Diagnose C – NTFS-Berechtigungen lesen

**Ausführungsort:** **Fileserver `FS01`**, mit Leseberechtigung auf die Sicherheitsinformationen des lokalen Verzeichnisses.

```powershell
# Speichert den lokalen Pfad zum betreffenden Unterordner.
# Das ist der Serverpfad, NICHT der UNC-Pfad des Mitarbeiters.
$ordner = 'D:\Freigaben\Projekte\Einkauf'

# Liest den Sicherheitsdeskriptor (einschließlich NTFS-ACL).
$acl = Get-Acl -LiteralPath $ordner

# Zeigt Besitzer und ob die Zugriffsvererbung deaktiviert ist.
$acl | Select-Object Owner, AreAccessRulesProtected

# Zeigt die einzelnen NTFS-Berechtigungsregeln lesbar an.
$acl.Access |
    Select-Object IdentityReference, FileSystemRights, AccessControlType, IsInherited
```

**Wie werden die Werte interpretiert?**

| Feld | Bedeutung |
|---|---|
| `IdentityReference` | Benutzer oder Gruppe, für die diese Regel gilt. |
| `FileSystemRights` | Verfügbares Dateisystemrecht, z. B. ReadAndExecute oder Modify. |
| `AccessControlType` | `Allow` erlaubt, `Deny` verweigert die in der Regel beschriebenen Rechte. |
| `IsInherited` | `True`: Regel wird von einem übergeordneten Ordner geerbt. |
| `AreAccessRulesProtected` | `True`: Vererbung für diese DACL ist geschützt/deaktiviert. |

**Alternative mit Windows-Kommandozeile, ebenfalls lesend:**

```powershell
# Zeigt die NTFS-Zugriffsregeln des angegebenen Ordners an.
# „icacls“ ist ein Windows-Programm, kein PowerShell-Cmdlet.
icacls 'D:\Freigaben\Projekte\Einkauf'
```

`icacls` verwendet Abkürzungen, z. B. `(F)` für Vollzugriff, `(M)` für Ändern, `(RX)` für Lesen/Ausführen, `(R)` für Lesen, `(I)` für geerbte Einträge.

**Achtung:** `Get-Acl` und `icacls` **zeigen Regeln**, aber berechnen nicht allein vollständig die effektive Berechtigung eines bestimmten Benutzers. Dafür sind dessen Sicherheitsgruppen, Token, Objektpfad, Vererbung, Share-Berechtigungen und gegebenenfalls weitere Sicherheitsmechanismen erforderlich.

**Quellen:** [Get-Acl](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-acl?view=powershell-5.1) · [icacls](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/icacls)

### Grafische Alternative: „Effektiver Zugriff“

Am Fileserver: **Ordner → Eigenschaften → Sicherheit → Erweitert → Effektiver Zugriff**. Benutzer auswählen und die ermittelten Rechte untersuchen. Diese Anzeige ist nützlich, jedoch kein Ersatz für einen echten Zugriffstest über die betreffende SMB-Freigabe und berücksichtigt möglicherweise nicht jede Umgebungsbedingung.

**Quelle:** [Microsoft Learn – Effective Access (Beispiel)](https://learn.microsoft.com/en-us/windows-server/identity/solution-guides/deploy-a-central-access-policy--demonstration-steps-)

## 9. Diagnose D – AD-Gruppenmitgliedschaft gegen den aktuellen Token prüfen

**Beispiel:** Die Datenverantwortlichen haben `a.meyer` zur Projektgruppe hinzugefügt. Die Gruppenzuweisung wurde im AD gespeichert, der Benutzer ist aber seitdem durchgehend angemeldet.

### AD-Gruppenmitgliedschaft (serverseitige Sicht)

**Ausführungsort:** Administrationsrechner mit RSAT/ActiveDirectory-Modul sowie Leserechten im AD.

```powershell
# Ruft die bekannten AD-Gruppenmitgliedschaften des Benutzers ab.
# -Identity gibt das zu prüfende Benutzerkonto an.
Get-ADPrincipalGroupMembership -Identity 'a.meyer' |
    # Gibt hier die Gruppennamen sortiert aus.
    Select-Object -ExpandProperty Name |
    Sort-Object
```

**Grenze:** Die Ausgabe ist kein vollständiger Simulator für jede verschachtelte, domänenübergreifende oder ressourcenlokale Berechtigung. Sie beschreibt AD-Gruppenzugehörigkeiten, aber nicht automatisch die aktuellen Rechte jeder geöffneten Sitzung.

### Aktueller Sitzungstoken (Benutzersicht)

**Ausführungsort:** **Im bereits angemeldeten Windows-Kontext von `FIRMA\a.meyer`**, nicht unter dem Konto des Supportadministrators.

```powershell
# Zeigt die Identität dieser konkreten Windows-Sitzung an.
whoami

# Zeigt die Gruppen- und SID-Informationen im aktuellen Token.
whoami /groups

# Für eine ausführlichere Darstellung zusätzlich möglich:
whoami /all
```

**Interpretation:** Steht die neue Gruppe im AD, aber noch nicht im Zugriffs-Token des Benutzers, können nach Organisationsfreigabe ein vollständiges Abmelden und erneutes Anmelden sowie ein erneuter SMB-Verbindungsaufbau erforderlich sein. Ein bloßes Sperren/Entsperren des Bildschirms oder `gpupdate /force` erneuert nicht verlässlich den kompletten Windows-Anmeldetoken.

**Quelle:** [Microsoft Learn – whoami](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/whoami) · [Get-ADPrincipalGroupMembership](https://learn.microsoft.com/en-us/powershell/module/activedirectory/get-adprincipalgroupmembership?view=windowsserver2025-ps)

## 10. Diagnose E – Erweiterte Serverprotokolle (L2)

Wenn die Ursache weiterhin unklar ist, kann die Windows-Sicherheitsüberwachung helfen. **Voraussetzung:** passende Überwachungsrichtlinien, gegebenenfalls SACLs und die Berechtigung, das Security-Protokoll zu lesen. Audit-Änderungen können hohe Protokollmengen erzeugen und gehören in die verantwortete Administration.

| Ereignis-ID | Zweck | Aussagegrenze |
|---|---|---|
| **5145** | Prüfung eines Zugriffs auf eine Netzwerkfreigabe | Fehlermeldungen hier beziehen sich auf die **Freigabeprüfung**; ein reiner NTFS-Deny muss kein 5145-Fehlerereignis erzeugen. |
| **4656** | Ein Handle auf ein Objekt wurde angefordert | Kann bei entsprechender Dateisystemüberwachung auch fehlgeschlagene Zugriffsanforderungen zeigen. |
| **4663** | Auf ein Objekt wurde zugegriffen | Ist für Dateisystemzugriffe **kein allgemeines Fehlerereignis**; Microsoft beschreibt hier erfolgreiche Nutzung eines Rechtes. |

**Beispiel einer rein lesenden Auswertung auf dem Fileserver:**

```powershell
# Wählt das Security-Protokoll und die Freigabe-Audit-ID 5145.
$filter = @{
    LogName   = 'Security'
    Id        = 5145
    StartTime = (Get-Date).AddMinutes(-30)
}

# Zeigt höchstens 20 passende Einträge.
# Datenmenge und Datenschutz beachten; nur befugt ausführen.
Get-WinEvent -FilterHashtable $filter -MaxEvents 20 |
    Select-Object TimeCreated, Id, Message
```

**Wichtig:** Sind keine Ereignisse vorhanden, heißt das nicht automatisch, dass es keine Zugriffsversuche gab. Audit-Voraussetzungen, falsches System oder falscher Zeitraum können die Erklärung sein.

**Quellen:** [Audit-Richtlinien](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/advanced-audit-policy-configuration) · [Event 5145](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-5145) · [Event 4663](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4663)

## 11. Befunde korrekt in Maßnahmen überführen

| Bestätigter Befund | Geeignete Maßnahme | Was vermeiden? |
|---|---|---|
| TCP 445 nicht erreichbar | DNS, Routing, Firewall, VPN, SMB-Server prüfen | NTFS-Rechte ohne Befund verändern |
| SMB-Authentifizierung scheitert | Tatsächlich verwendete Identität und Sicherheitsrichtlinien prüfen | SMB1 oder Gastzugriff als Schnelllösung einschalten |
| Share-ACL zu restriktiv | Durch Datenverantwortliche autorisierte, eng begrenzte Freigaberechte anpassen | `Jeder: Vollzugriff` setzen |
| NTFS-ACL enthält benötigte Gruppe nicht | Freigegebene Gruppenberechtigung am richtigen Ordner setzen; Vererbung beachten | Vererbung rekursiv löschen/überschreiben |
| Neue AD-Gruppe noch nicht im Sitzungstoken | Geregeltes vollständiges Ab-/Anmelden und Zugriffsprüfung | Fälschlich `gpupdate /force` als Token-Refresh verkaufen |
| Expliziter `Deny` für benötigtes Recht | Ursache und Sicherheitsabsicht der Regel prüfen; zuständig eskalieren | Deny ohne Berechtigungsfreigabe entfernen |
| Nur Datei schreibgeschützt/in Benutzung | Dateiattribute und offenen Schreibzugriff getrennt prüfen | Blind ACLs erhöhen |

### Praxisbeispiel: Warum „Lesen“ nicht „Ändern“ bedeutet

Ein Benutzer kann den Ordner `\\FS01\Projekte\Einkauf` öffnen und eine Excel-Datei lesen. Beim Speichern erscheint aber „Zugriff verweigert“. Das kann heißen, dass **Leserechte vorhanden, Schreib-/Änderungsrechte aber nicht erteilt** sind. Es kann ebenso an einer Dateisperre oder Anwendungs-/Dateikonfiguration liegen. Daher zunächst klären, ob auch eine **neue Datei im freigegebenen Testordner** erstellt werden darf – nur sofern ein solcher Test ausdrücklich erlaubt ist.

### Änderungen sind gesonderte, freigabepflichtige Maßnahmen

Die Beispiele im Diagnosekapitel sind **lesend**. Das Ändern von Gruppenmitgliedschaften, `icacls /grant`, `icacls /reset`, `Set-Acl` oder `Grant-SmbShareAccess` kann Sicherheitswirkungen haben und gehört **nicht** in eine unbedachte Erstmaßnahme. Vor Eingriffen Soll-Rechte, Backup/Export der ACL, Änderungsumfang und Rückweg klären. Gruppen und Berechtigungen bevorzugt nach dem etablierten Rollenmodell der Organisation verwalten.

## 12. Erfolgskontrolle – am wirklichen Benutzerfall

1. Betroffener Benutzer `FIRMA\a.meyer` meldet sich bei Bedarf neu an.
2. Über **denselben UNC-Pfad** wird die ursprüngliche Operation wiederholt.
3. Nur die **freigegebene** Operation darf möglich sein (z. B. *Lesen*, nicht automatisch *Ändern*).
4. Vergleich mit der ursprünglich betroffenen Datei/dem Ordner, nicht nur mit einem anderen Freigabeverzeichnis.
5. Keine ungewollten Freigaben für andere Gruppen entstanden; Änderung dokumentiert.

## 13. L1-/L2-Abgrenzung und Eskalation

| L1 – typische Aufgaben | L2 – typische Aufgaben |
|---|---|
| Genaue Fehlermeldung und Pfad aufnehmen | Komplexe ACL-/Vererbungsprobleme untersuchen |
| Betroffenheit, Identität, Freigabe und einfache Verbindung eingrenzen | SMB-Audits, AD-/Gruppennesting, Server- und zentrale Zugriffsrichtlinien analysieren |
| Bekannte Standardverfahren durchführen, ggf. berechtigte Gruppenmitgliedschaft beantragen | Genehmigte NTFS-/Share-Berechtigungsänderungen technisch umsetzen und prüfen |
| Ergebnisse dokumentieren und sauber eskalieren | Übergreifende oder sicherheitskritische Berechtigungsprobleme koordinieren |

**Eskalieren, wenn** Eigentümer-/Freigabefrage offen ist, sensible Daten betroffen sind, mehrere Abteilungen nicht mehr zugreifen können, Deny-/Vererbungsketten unklar sind oder ein Sicherheitsvorfall möglich erscheint. Die unternehmensinternen Zuständigkeiten haben Vorrang.

## 14. Musterticket (rein fiktiv)

**INC-005 – Zugriff auf Netzwerkordner verweigert**  
**Symptom:** Benutzer `FIRMA\a.meyer` kann `\\FS01\Projekte\Einkauf` nicht öffnen; Kollegin kann zugreifen.  
**Diagnose:** TCP 445 zum Server erfolgreich; Freigabe `Projekte` erreichbar. Freigabe-ACL und NTFS-ACL am Unterordner geprüft. AD-Gruppenmitgliedschaft war eingetragen, im aktuellen Benutzertoken fehlte die neue Gruppe noch.  
**Ursache:** Die neue Gruppenmitgliedschaft war in der bereits laufenden Windows-Sitzung noch nicht wirksam.  
**Maßnahme:** Nach Abstimmung laufende Arbeit gespeichert, vollständige Ab-/Anmeldung des Benutzers durchgeführt; SMB-Zugriff erneut hergestellt. Keine Berechtigungen erweitert.  
**Ergebnis:** Betroffener Unterordner kann mit dem vorgesehenen **Leserecht** geöffnet werden; eine nicht genehmigte Änderung der Dateien wurde nicht ermöglicht.  
**Status:** Gelöst (**Beispiel**, nicht praktisch ausgeführt).

## 15. Lernkontrolle, praktische Tests und Quellen

### Lernfragen (ohne sofortige Lösung)

1. Weshalb beweist `TcpTestSucceeded : True` auf Port 445 nicht, dass ein Benutzer eine Datei lesen darf?
2. Wo musst du `Get-SmbShareAccess` und `Get-Acl` ausführen, wenn du die lokalen Rechte der Freigabe von `FS01` lesen willst?
3. Was ist der Unterschied zwischen **AD-Gruppenmitgliedschaft** und den Gruppenkennungen eines **Windows-Zugriffstokens**?
4. Ein Benutzer kann eine Datei lesen, aber nicht speichern. Welche mindestens zwei Ursachen würdest du prüfen?
5. Warum ist `Jeder: Vollzugriff` keine angemessene Standardlösung?

**Anki-Vorbereitung:** Wissenskarten (ACL, ACE, SMB, NTFS), Verständniskarten (zwei Schranken, Token, Vererbung), Diagnosekarten (neue Gruppenmitgliedschaft, Port 445 erreichbar aber Unterordner gesperrt, Lesen möglich/Schreiben nicht). Karten werden erst nach fachlicher Prüfung in den Anki-/FSRS-Bestand übernommen.

### Eigene Validierung – noch offen

- In einer genehmigten Testumgebung eine Freigabe mit Lese- und Änderungsrechten konfigurieren.
- Benutzer- und Gruppenrechte gezielt verändern und die effektiven Ergebnisse prüfen.
- Mit zwei Benutzerkonten testen, ob ein Leser lesen, aber nicht verändern darf.
- Gruppenänderung und erneute Anmeldung vergleichen.
- Screenshots ausschließlich ohne Klarnamen, Geheimnisse und interne Netzwerkdaten veröffentlichen.

### Technische Quellen (Stand 07.11.2026)

1. [Microsoft Learn – SMB-Freigabe: Zugriff verweigert und moderne Sicherheitsanforderungen](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/access-denied-access-smb-file-share) – Einordnung der Symptome und Sicherheitsänderungen.
2. [Microsoft Learn – Freigabe- und NTFS-Berechtigungen](https://learn.microsoft.com/de-de/iis/web-hosting/configuring-servers-in-the-windows-web-platform/configuring-share-and-ntfs-permissions) – Zwei Berechtigungsebenen.
3. [Microsoft Learn – Get-SmbShareAccess](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbshareaccess) – Freigabe-ACL auslesen.
4. [Microsoft Learn – Get-Acl](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-acl?view=powershell-5.1) – Dateisystem-Sicherheitsdeskriptor lesen.
5. [Microsoft Learn – icacls](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/icacls) – NTFS-ACL anzeigen und Optionen verstehen.
6. [Microsoft Learn – whoami](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/whoami) – Aktuelles Benutzer-/Gruppentoken überprüfen.
7. [Microsoft Learn – Get-ADPrincipalGroupMembership](https://learn.microsoft.com/en-us/powershell/module/activedirectory/get-adprincipalgroupmembership?view=windowsserver2025-ps) – AD-Gruppen prüfen.
8. [Microsoft Learn – Effektiver Zugriff](https://learn.microsoft.com/en-us/windows-server/identity/solution-guides/deploy-a-central-access-policy--demonstration-steps-) – GUI-basierte effektive Berechtigungsprüfung.
9. [Microsoft Learn – Advanced Audit Policy](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/advanced-audit-policy-configuration) – Voraussetzungen für Ereignisprotokolle.
10. [Microsoft Learn – Ereignis 5145](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-5145) – Zugriffsprüfung an SMB-Freigaben.
11. [Microsoft Learn – Ereignis 4663](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4663) – Erfolgreiche Nutzung eines Dateiobjekt-Zugriffsrechts.

**Ergänzung vom 08.11.2026:** [Anfängerfreundliche Grundlagen zu Freigaben, NTFS und GPO](RB-005_Grundlagen_Freigabe-und-NTFS.md) mit weiterer Henne-Ei-Infografik und Microsoft-Quellen.

**Transparenz:** Recherche und Didaktik sind dokumentiert; eigene Tests fehlen noch. Die beschriebenen Beispiele sind keine Behauptung über produktive Einsätze.
