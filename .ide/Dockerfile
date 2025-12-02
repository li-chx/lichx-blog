FROM cnbcool/default-build-env:latest

RUN apt-get update && \
    apt-get install -y wget unzip lsof nload htop net-tools dnsutils openssh-server zsh openssh-server command-not-found && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /root
RUN git clone https://git.lichx.top/li_chx/shell-config.git && \
    cp -r shell-config/.* . && \
    wget https://download.jetbrains.com/webstorm/WebStorm-2025.2.5.tar.gz && \
    mkdir -p /ide_cnb && \
    tar -zxvf WebStorm-2025.2.5.tar.gz -C /ide_cnb && \
    rm WebStorm-2025.2.5.tar.gz && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && \
    source ~/.bashrc && \
    nvm install 24 && \
    npm install --global corepack@latest && \
    corepack enable pnpm && \
    apt update

# 单独处理 zsh 配置
RUN zsh -c "source ~/.zshrc" && \
    echo "zsh" >> ~/.bashrc

RUN curl -fsSL https://code-server.dev/install.sh | sh \
  && code-server --install-extension nuxtr.nuxt-vscode-extentions \
  && code-server --install-extension bradlc.vscode-tailwindcss \
  && code-server --install-extension tencent-cloud.coding-copilot \
  && code-server --install-extension ms-vscode.vs-keybindings
    
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8
