import env, { EnvConfig, Envs } from "./env";

type Config = {
  test:'看我'
};

const config: Partial<Config & EnvConfig[Envs]> = {
  test:'看我'
};

Object.assign(config, env);

export default config;
