#!/bin/bash

SESSION="luxly-dev"

# 1. Eski session varsa temizle
tmux kill-session -t $SESSION 2>/dev/null

# ==============================================================================
# STRATEJİ: Pencereyi açarken komutu içine gömüyoruz.
# "|| exec $SHELL" kısmı, hata olursa terminalin kapanmamasını sağlar.
# ==============================================================================

# 1. PANE (Sol Üst): WEB (Ana Session Başlangıcı)
# Not: Klasörün apps/web olduğunu varsayıyoruz. Değilse düzelt.
tmux new-session -d -s $SESSION "cd apps/web && bun dev || echo 'WEB BAŞLATILAMADI'; exec $SHELL"

# 2. PANE (Sağ Üst): API
# Ekranı ikiye böl (-h: horizontal) ve komutu çalıştır
tmux split-window -h "cd apps/api && bun start:dev || echo 'API BAŞLATILAMADI'; exec $SHELL"

# 3. PANE (Sol Alt): WORKER
# Sol panele (Pane 0) odaklan ve altını böl (-v: vertical)
tmux select-pane -t 0
tmux split-window -v "cd apps/worker && bun start:dev || echo 'WORKER BAŞLATILAMADI'; exec $SHELL"

# 4. PANE (Sağ Alt): COLLAB
# Sağ panele (Pane 2 oldu kaydığı için) odaklan ve altını böl
# Not: Collab genelde web içinde olabilir, klasörün varlığından emin ol.
tmux select-pane -t 2
tmux split-window -v "cd apps/collab && bun start:dev || echo 'COLLAB BAŞLATILAMADI'; exec $SHELL"

# ==============================================================================
# GÖRÜNÜM AYARLARI
# ==============================================================================

# Mouse ile tıklama ve scroll'u aç
tmux set -g mouse on

# 4 kareyi eşit dağıt
tmux select-layout tiled

# Session'a bağlan
tmux attach-session -t $SESSION