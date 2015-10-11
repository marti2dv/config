# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

#cycling auto-complete
bind TAB:menu-complete

# User specific aliases and functions
alias la='ls -a'
alias nv='nvim'
alias py='python3'
alias opn='xdg-open'
alias reload_xresources='xrdb -merge ~/.Xresources'

# add personal bin folder to PATH
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# ls colors
eval "`dircolors ~/.mydircolors`"
LS_COLORS=$LS_COLORS:'di=01;93:' ; export LS_COLORS

#autoenv
# source ~/src/autoenv/activate.sh
