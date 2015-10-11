(require 'package)
(push '("marmalade" . "http://marmalade-repo.org/packages/")
      package-archives)
(push '("melpa" . "http://melpa.milkbox.net/packages/")
      package-archives)
(package-initialize)

;; font size
(set-face-attribute 'default nil :height 100)

;; color scheme
(load-theme 'wombat)

;; line numbers
(global-linum-mode t)

;; hide menu bars
(menu-bar-mode -1)
(tool-bar-mode -1)

;; ------------------EVIL---------------
;;evil mode & settings
(require 'evil)
(evil-mode 1)
;;; esc quits
(defun minibuffer-keyboard-quit ()
  "Abort recursive edit.
In Delete Selection mode, if the mark is active, just deactivate it;
then it takes a second \\[keyboard-quit] to abort the minibuffer."
  (interactive)
  (if (and delete-selection-mode transient-mark-mode mark-active)
      (setq deactivate-mark t)
    (when (get-buffer "*Completions*") (delete-windows-on "*Completions*"))
    (abort-recursive-edit)))
(define-key evil-normal-state-map [escape] 'keyboard-quit)
(define-key evil-visual-state-map [escape] 'keyboard-quit)
(define-key minibuffer-local-map [escape] 'minibuffer-keyboard-quit)
(define-key minibuffer-local-ns-map [escape] 'minibuffer-keyboard-quit)
(define-key minibuffer-local-completion-map [escape] 'minibuffer-keyboard-quit)
(define-key minibuffer-local-must-match-map [escape] 'minibuffer-keyboard-quit)
(define-key minibuffer-local-isearch-map [escape] 'minibuffer-keyboard-quit)

;; split window navigation
;;(define-key evil-normal-state-map "H" 'evil-window-left)
;;(define-key evil-normal-state-map "L" 'evil-window-right)
(define-key evil-normal-state-map "J" 'evil-window-down)
(define-key evil-normal-state-map "K" 'evil-window-up)

;; vim style tabs
(require 'elscreen)
(load "elscreen" "ElScreen" t)
(elscreen-start)
(define-key evil-normal-state-map (kbd "C-w t") 'elscreen-create)
(define-key evil-normal-state-map (kbd "C-w x") 'elscreen-kill)
(define-key evil-normal-state-map "L" 'elscreen-next)
(define-key evil-normal-state-map "H" 'elscreen-previous)

;; paste from clipboard
(define-key evil-normal-state-map (kbd "C-v") 'x-clipboard-yank)

;; ------------------EVIL---------------


;; cuda file syntax highlighting
(add-to-list 'auto-mode-alist '("\\.cu\\'" . c++-mode))


;; c indentation level
(setq-default c-basic-offset 4)


;; custom
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
    ("26614652a4b3515b4bbbb9828d71e206cc249b67c9142c06239ed3418eff95e2" "3c83b3676d796422704082049fc38b6966bcad960f896669dfc21a7a37a748fa" default)))
 '(inhibit-startup-screen t))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )


;; powerline
(require 'powerline)
(setq powerline-arrow-shape 'curve)
(setq powerline-default-separator-dir '(right . left))
(setq sml/theme 'powerline)
(sml/setup)

;; -------------- JAVASCRIPT ----------------
;; json file as js mode
(add-to-list 'auto-mode-alist '("\\.json$" . js-mode))

(require 'js2-mode)
(require 'ac-js2)
;; activate js2 and auto complete
(add-hook 'js-mode-hook 'js2-minor-mode)
(add-hook 'js2-mode-hook 'ac-js2-mode)
;; syntax highlighting level (0-3)
(setq js2-highlight-level 2)

;; -------------- JAVASCRIPT ----------------
;; -------------- PYTHON ----------------
(add-hook 'python-mode-hook 'jedi:setup)
(setq jedi:complete-on-dot t)
;; -------------- PYTHON ----------------

;; yasnippet and autocomplete
;;(require 'yasnippet)
;;(yas-global-mode 1)

(require 'auto-complete-config)
(ac-config-default)
(ac-set-trigger-key "TAB")
(ac-set-trigger-key "<tab>")
