import {Config} from '@remotion/cli/config';

Config.setCodec('h264');
Config.setVideoImageFormat('jpeg');
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
// Tudo que está em public/ vira staticFile('<pasta>/arquivo').
Config.setPublicDir('public');
Config.setCachingEnabled(false);
