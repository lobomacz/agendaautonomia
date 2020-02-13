/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module 'pdfmake/build/pdfmake.js';
declare module 'pdfmake/buld/vfs_fonts.js';