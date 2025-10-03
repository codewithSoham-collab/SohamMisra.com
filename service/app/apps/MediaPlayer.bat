@echo off
title Ultimate Media Player - Soham Misra
color 0C
mode con: cols=100 lines=30
cls

echo.
echo  ███╗   ███╗███████╗██████╗ ██╗ █████╗     ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
echo  ████╗ ████║██╔════╝██╔══██╗██║██╔══██╗    ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
echo  ██╔████╔██║█████╗  ██║  ██║██║███████║    ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
echo  ██║╚██╔╝██║██╔══╝  ██║  ██║██║██╔══██║    ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
echo  ██║ ╚═╝ ██║███████╗██████╔╝██║██║  ██║    ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
echo  ╚═╝     ╚═╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝    ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
echo.
echo                                  By Soham Misra - Version 1.0.0
echo.
echo  ══════════════════════════════════════════════════════════════════════════════════════════════════
echo.

:menu
echo  [1] Music Library    [2] Video Library    [3] Playlists    [4] Now Playing    [5] Equalizer    [6] Exit
echo.
set /p choice="  Select option (1-6): "

if "%choice%"=="1" goto music
if "%choice%"=="2" goto video
if "%choice%"=="3" goto playlists
if "%choice%"=="4" goto nowplaying
if "%choice%"=="5" goto equalizer
if "%choice%"=="6" goto exit
goto menu

:music
cls
echo.
echo  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
echo  ║                                      MUSIC LIBRARY                                              ║
echo  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝
echo.
echo  🎵 RECENTLY PLAYED TRACKS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [1] ♪ Bohemian Rhapsody - Queen                    Duration: 5:55    Quality: FLAC 96kHz
echo  [2] ♪ Hotel California - Eagles                    Duration: 6:30    Quality: MP3 320kbps
echo  [3] ♪ Imagine - John Lennon                        Duration: 3:07    Quality: FLAC 48kHz
echo  [4] ♪ Stairway to Heaven - Led Zeppelin            Duration: 8:02    Quality: MP3 320kbps
echo  [5] ♪ Billie Jean - Michael Jackson                 Duration: 4:54    Quality: FLAC 96kHz
echo  [6] ♪ Sweet Child O' Mine - Guns N' Roses          Duration: 5:03    Quality: MP3 320kbps
echo  [7] ♪ Smells Like Teen Spirit - Nirvana            Duration: 5:01    Quality: FLAC 48kHz
echo  [8] ♪ Thunderstruck - AC/DC                        Duration: 4:52    Quality: MP3 320kbps
echo.
echo  🎼 MUSIC GENRES ^& COLLECTIONS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  🎸 Rock (45 songs)      🎤 Pop (38 songs)       🎺 Jazz (22 songs)      🎻 Classical (15 songs)
echo  🎵 Blues (18 songs)     🎛️  Electronic (31)      🎤 Hip-Hop (27)         🤠 Country (12 songs)
echo  🎸 Metal (20 songs)     🎹 Piano (14 songs)     🎷 Smooth Jazz (16)     🎵 Indie (25 songs)
echo.
echo  📊 LIBRARY STATISTICS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  Total Songs: 283                      Total Duration: 18h 47m 32s
echo  Total Library Size: 3.2 GB            Average Quality: 285 kbps
echo  Most Played Track: Bohemian Rhapsody   Favorite Genre: Rock (32%%)
echo  Recently Added: 12 songs              Favorite Artist: Queen
echo.
echo  🎮 PLAYBACK CONTROLS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [P] Play selected    [S] Shuffle all    [R] Repeat mode    [F] Add to favorites    [Enter] Back
echo.
set /p action="  Action: "
if "%action%"=="P" goto playmusic
if "%action%"=="p" goto playmusic
if "%action%"=="S" goto shuffle
if "%action%"=="s" goto shuffle
echo  Returning to menu...
timeout /t 1 >nul
goto menu

:playmusic
echo.
echo  🎵 ♪ ♫ ♪ NOW PLAYING ♪ ♫ ♪ 🎵
echo  ═══════════════════════════════════════
echo  🎤 Track: Bohemian Rhapsody
echo  🎸 Artist: Queen
echo  💿 Album: A Night at the Opera (1975)
echo  ⏱️  Duration: 5:55
echo  🔊 Quality: FLAC 96kHz/24-bit
echo.
echo  Progress: ████████████████████████████████████████ 100%% [5:55/5:55]
echo.
echo  ♪ ♫ ♪ "Is this the real life? Is this just fantasy?" ♪ ♫ ♪
echo  ♫ ♪ ♫ "Caught in a landslide, no escape from reality" ♫ ♪ ♫
echo.
timeout /t 3 >nul
goto music

:shuffle
echo.
echo  🔀 SHUFFLE MODE ACTIVATED
echo  ═══════════════════════════════════════
echo  🎵 Playing random tracks from your library...
echo  
echo  Now Playing: Sweet Child O' Mine - Guns N' Roses
echo  Next Up: Thunderstruck - AC/DC
echo  Queue: 283 songs shuffled
echo.
timeout /t 2 >nul
goto music

:video
cls
echo.
echo  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
echo  ║                                      VIDEO LIBRARY                                              ║
echo  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝
echo.
echo  🎬 FEATURED MOVIES ^& VIDEOS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [1] 🎥 The Matrix (1999)                          Duration: 2h 16m   Quality: 4K UHD HDR
echo  [2] 🎥 Inception (2010)                           Duration: 2h 28m   Quality: 1080p BluRay
echo  [3] 🎥 Interstellar (2014)                        Duration: 2h 49m   Quality: 4K UHD HDR
echo  [4] 🎥 The Dark Knight (2008)                     Duration: 2h 32m   Quality: 1080p BluRay
echo  [5] 🎥 Pulp Fiction (1994)                        Duration: 2h 34m   Quality: 720p Remaster
echo  [6] 🎥 Avatar (2009)                              Duration: 2h 42m   Quality: 4K UHD HDR
echo  [7] 🎥 Avengers: Endgame (2019)                   Duration: 3h 01m   Quality: 4K UHD HDR
echo  [8] 🎥 The Shawshank Redemption (1994)            Duration: 2h 22m   Quality: 1080p BluRay
echo.
echo  📁 VIDEO CATEGORIES:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  🎬 Action (15 videos)     🚀 Sci-Fi (12 videos)      🎭 Drama (18 videos)     😂 Comedy (14 videos)
echo  😱 Thriller (11 videos)   📚 Documentary (8 videos)   🎨 Animation (10 videos) 👻 Horror (7 videos)
echo  💕 Romance (9 videos)     🏛️  Historical (6 videos)   🎵 Musical (5 videos)    🌍 Nature (12 videos)
echo.
echo  📊 VIDEO LIBRARY STATISTICS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  Total Videos: 127                     Total Duration: 287h 45m 18s
echo  Total Library Size: 1.2 TB            Average Quality: 1080p
echo  Most Watched: The Matrix (47 times)    Favorite Genre: Sci-Fi (28%%)
echo  Recently Added: 8 videos              Favorite Director: Christopher Nolan
echo.
echo  🎮 PLAYBACK CONTROLS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [P] Play selected    [F] Fullscreen    [S] Subtitles    [Q] Quality settings    [Enter] Back
echo.
set /p action="  Action: "
if "%action%"=="P" goto playvideo
if "%action%"=="p" goto playvideo
if "%action%"=="F" goto fullscreen
if "%action%"=="f" goto fullscreen
echo  Returning to menu...
timeout /t 1 >nul
goto menu

:playvideo
echo.
echo  🎬 ═══════════════════════════════════════════════════════════════════════════════════════════ 🎬
echo  ║                                                                                             ║
echo  ║                                    🎬 THE MATRIX 🎬                                         ║
echo  ║                                                                                             ║
echo  ║                              "Welcome to the Real World"                                    ║
echo  ║                                                                                             ║
echo  ║                                   [●●●●●●●●●●] 100%%                                        ║
echo  ║                                                                                             ║
echo  ║  Quality: 4K UHD HDR    Audio: Dolby Atmos 7.1    Subtitles: English    Time: 2:16:00    ║
echo  ║                                                                                             ║
echo  🎬 ═══════════════════════════════════════════════════════════════════════════════════════════ 🎬
echo.
timeout /t 3 >nul
goto video

:fullscreen
echo.
echo  🖥️  FULLSCREEN MODE ACTIVATED
echo  ═══════════════════════════════════════
echo  🎬 Video expanded to full screen
echo  🔊 Audio: Dolby Atmos 7.1 Surround
echo  📺 Display: 4K UHD HDR Enhanced
echo  ⌨️  Press ESC to exit fullscreen
echo.
timeout /t 2 >nul
goto video

:playlists
cls
echo.
echo  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
echo  ║                                        PLAYLISTS                                                ║
echo  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝
echo.
echo  📝 MY CUSTOM PLAYLISTS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [1] ❤️  My Favorites                    47 tracks    Duration: 3h 28m    Last Updated: Today
echo  [2] 🎸 Rock Legends                     35 tracks    Duration: 2h 45m    Last Updated: Yesterday  
echo  [3] 🎵 Chill ^& Relax                    28 tracks    Duration: 1h 52m    Last Updated: 2 days ago
echo  [4] 🏃 Workout Motivation               42 tracks    Duration: 2h 38m    Last Updated: 1 week ago
echo  [5] 🌙 Late Night Vibes                 24 tracks    Duration: 1h 35m    Last Updated: 3 days ago
echo  [6] 🎬 Epic Movie Soundtracks           31 tracks    Duration: 2h 18m    Last Updated: 1 week ago
echo  [7] 🎹 Classical Masterpieces           18 tracks    Duration: 1h 45m    Last Updated: 2 weeks ago
echo  [8] 🎤 90s Hits Collection              39 tracks    Duration: 2h 52m    Last Updated: 5 days ago
echo.
echo  🔥 TRENDING ^& DISCOVER PLAYLISTS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  • 🌍 Global Top 50 (Updated Daily)       • 🎵 Today's Viral Hits (Updated Hourly)
echo  • 🎸 Rock Rising (New Rock Tracks)       • 🎤 RapCaviar (Hip-Hop Essentials)
echo  • 🎹 New Music Friday (Fresh Releases)   • 🎵 Pop Rising (Trending Pop Songs)
echo  • 🎧 Discover Weekly (Personalized)      • 🎼 Classical Crossover (Modern Classical)
echo.
echo  📊 PLAYLIST STATISTICS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  Total Personal Playlists: 8           Total Tracks Across Playlists: 264
echo  Most Played Playlist: My Favorites    Average Playlist Length: 2h 14m
echo  Recently Created: 2 playlists         Shared with Friends: 3 playlists
echo  Total Listening Time: 17h 53m         Favorite Playlist Genre: Rock
echo.
echo  🎮 PLAYLIST ACTIONS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [P] Play playlist    [C] Create new    [E] Edit playlist    [S] Share playlist    [Enter] Back
echo.
set /p action="  Action: "
if "%action%"=="P" goto playplaylist
if "%action%"=="p" goto playplaylist
if "%action%"=="C" goto createplaylist
if "%action%"=="c" goto createplaylist
echo  Returning to menu...
timeout /t 1 >nul
goto menu

:playplaylist
echo.
echo  🎵 PLAYING PLAYLIST: My Favorites ❤️
echo  ═══════════════════════════════════════════════════════════════════════════════════════════
echo  🎤 Now Playing: Bohemian Rhapsody - Queen
echo  ⏭️  Up Next: Hotel California - Eagles
echo  📊 Progress: Track 1 of 47 (Duration: 3h 28m remaining)
echo  🔀 Shuffle: OFF    🔁 Repeat: Playlist    🔊 Volume: 85%%
echo.
echo  ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫
echo.
timeout /t 3 >nul
goto playlists

:createplaylist
echo.
echo  ➕ CREATE NEW PLAYLIST:
echo  ═══════════════════════════════════════
set /p name="  Playlist Name: "
set /p desc="  Description (optional): "
echo.
echo  ✅ Playlist "%name%" created successfully!
echo     Description: %desc%
echo     Tracks: 0 (Ready to add songs)
echo     Created: %date% %time%
echo     Privacy: Private (You can change this later)
echo.
timeout /t 2 >nul
goto playlists

:nowplaying
cls
echo.
echo  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
echo  ║                                      NOW PLAYING                                               ║
echo  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝
echo.
echo                                  🎵 BOHEMIAN RHAPSODY 🎵
echo                                      by Queen
echo                                 Album: A Night at the Opera (1975)
echo                                   Genre: Progressive Rock
echo.
echo  ┌──────────────────────────────────────────────────────────────────────────────────────────────┐
echo  │                                                                                              │
echo  │                                    ♪ ♫ ♪ ♫ ♪ ♫                                              │
echo  │                                                                                              │
echo  │                              🎤 "Is this the real life?" 🎤                                 │
echo  │                            🎤 "Is this just fantasy?" 🎤                                    │
echo  │                          🎤 "Caught in a landslide..." 🎤                                   │
echo  │                                                                                              │
echo  │                                    ♪ ♫ ♪ ♫ ♪ ♫                                              │
echo  │                                                                                              │
echo  └──────────────────────────────────────────────────────────────────────────────────────────────┘
echo.
echo  Progress: ████████████████████████████████████████ 100%% [5:55/5:55]
echo.
echo  🎮 MEDIA CONTROLS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [⏮️ ] Previous    [⏸️ ] Pause    [⏭️ ] Next    [🔀] Shuffle    [🔁] Repeat    [❤️ ] Favorite
echo.
echo  🔊 AUDIO SETTINGS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  Volume: ████████████████████████████████████████ 85%%
echo  Bass Boost: ████████████████████████████████████████ 70%%
echo  Treble: ████████████████████████████████████████ 60%%
echo  3D Surround: [ON]    Equalizer: Rock Preset    Audio Quality: FLAC 96kHz
echo.
echo  📊 TRACK INFORMATION:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  Bitrate: 2304 kbps (FLAC)    Sample Rate: 96 kHz    Channels: Stereo
echo  File Size: 54.2 MB           Play Count: 47 times   Last Played: Today
echo  Added to Library: 2 years ago    Rating: ⭐⭐⭐⭐⭐ (5/5)
echo.
echo  Press any key to return to menu...
pause >nul
goto menu

:equalizer
cls
echo.
echo  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
echo  ║                                       EQUALIZER                                                 ║
echo  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝
echo.
echo  🎚️  AUDIO EQUALIZER SETTINGS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo.
echo   60Hz   170Hz  310Hz  600Hz  1kHz   3kHz   6kHz   12kHz   16kHz   20kHz   Preset: Rock
echo    │      │      │      │      │      │      │      │      │      │
echo    █      █      ░      ░      █      █      █      █      ░      ░      +12dB
echo    █      █      ░      ░      █      █      █      █      ░      ░      +9dB
echo    █      █      ░      ░      █      █      █      █      ░      ░      +6dB
echo    █      █      ░      ░      █      █      █      █      ░      ░      +3dB
echo    █      █      █      █      █      █      █      █      █      █      0dB
echo    █      █      █      █      █      █      █      █      █      █      -3dB
echo    █      █      █      █      █      █      █      █      █      █      -6dB
echo    █      █      █      █      █      █      █      █      █      █      -9dB
echo    █      █      █      █      █      █      █      █      █      █      -12dB
echo.
echo  🎵 EQUALIZER PRESETS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [1] Flat        [2] Rock        [3] Pop         [4] Jazz        [5] Classical
echo  [6] Electronic  [7] Hip-Hop     [8] Country     [9] Vocal       [0] Custom
echo.
echo  🔊 ADVANCED AUDIO EFFECTS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  Bass Boost: ████████████████████████████████████████ 70%% [ON]
echo  3D Virtualizer: ████████████████████████████████████████ 50%% [ON]
echo  Reverb Effect: ████████████████████████████████████████ 30%% [OFF]
echo  Loudness Enhancement: ████████████████████████████████████████ 40%% [ON]
echo.
echo  🎧 AUDIO OUTPUT SETTINGS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  Output Device: Headphones (High Impedance)    Sample Rate: 96 kHz
echo  Bit Depth: 24-bit                            Channels: Stereo
echo  Audio Driver: ASIO (Low Latency)              Buffer Size: 256 samples
echo.
echo  🎮 EQUALIZER CONTROLS:
echo  ────────────────────────────────────────────────────────────────────────────────────────────────
echo  [1-0] Select preset    [R] Reset to flat    [S] Save custom    [T] Toggle effects    [Enter] Back
echo.
set /p action="  Action: "
if "%action%"=="2" goto rockpreset
if "%action%"=="R" goto reset
if "%action%"=="r" goto reset
echo  Returning to menu...
timeout /t 1 >nul
goto menu

:rockpreset
echo.
echo  🎸 ROCK PRESET APPLIED
echo  ═══════════════════════════════════════
echo  ✅ Bass frequencies boosted (+6dB)
echo  ✅ Mid frequencies enhanced (+3dB)
echo  ✅ Treble frequencies amplified (+6dB)
echo  ✅ Vocal range optimized
echo  🎵 Perfect for rock, metal, and alternative music!
echo.
timeout /t 2 >nul
goto equalizer

:reset
echo.
echo  🔄 EQUALIZER RESET TO FLAT
echo  ═══════════════════════════════════════
echo  ✅ All frequency bands set to 0dB
echo  ✅ Audio effects disabled
echo  ✅ Natural, unprocessed sound restored
echo.
timeout /t 2 >nul
goto equalizer

:exit
cls
echo.
echo  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
echo  ║                                   THANK YOU                                                     ║
echo  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝
echo.
echo                          🎵 Thanks for using Ultimate Media Player! 🎵
echo                              Keep enjoying your music and videos! 🎬
echo.
echo                                   Developed with ❤️  by
echo                                      SOHAM MISRA
echo.
echo                              Visit: www.sohammisra-apps.com
echo.
timeout /t 3 >nul
exit