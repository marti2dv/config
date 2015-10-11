# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/.local/bin:$HOME/bin:/usr/local/cuda-7.0/bin
export LD_LIBRARY_PATH=/home/david/src/lib:/usr/local/cudo-7.0/lib64:$LD_LIBRARY_PATH
export PYTHONPATH=$PYTHONPATH:/usr/lib64/python2.7/scipy

export PATH
