{
  description = "Luxly Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        nativeBuildInputs = [
          pkgs.openssl
        ];

        buildInputs = [
          pkgs.bun
          pkgs.prisma-engines
          pkgs.stdenv.cc.cc.lib
        ];

        shellHook = ''
          export PRISMA_SKIP_POSTINSTALL_GENERATE=1
          export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
          export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.so"
          export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"

          export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"
        '';
      };
    };
}