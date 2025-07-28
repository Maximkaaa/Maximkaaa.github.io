declare namespace wasm_bindgen {
	/* tslint:disable */
	/* eslint-disable */
	export function main(): void;
	export function init_vt_worker(): void;
	export function process_message(msg: any): any;
	/**
	 * Index of a tile.
	 */
	export class TileIndex {
	  private constructor();
	  free(): void;
	  /**
	   * Z index.
	   */
	  z: number;
	  /**
	   * X index.
	   */
	  x: number;
	  /**
	   * Y index.
	   */
	  y: number;
	}
	
}

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly main: () => void;
  readonly init_vt_worker: () => void;
  readonly process_message: (a: any) => any;
  readonly __wbg_tileindex_free: (a: number, b: number) => void;
  readonly __wbg_get_tileindex_z: (a: number) => number;
  readonly __wbg_set_tileindex_z: (a: number, b: number) => void;
  readonly __wbg_get_tileindex_x: (a: number) => number;
  readonly __wbg_set_tileindex_x: (a: number, b: number) => void;
  readonly __wbg_get_tileindex_y: (a: number) => number;
  readonly __wbg_set_tileindex_y: (a: number, b: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_1: WebAssembly.Table;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h91a90419d48a2842_multivalue_shim: (a: number, b: number) => [number, number];
  readonly __externref_table_dealloc: (a: number) => void;
  readonly closure475_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure3128_externref_shim: (a: number, b: number, c: any) => void;
  readonly __wbindgen_start: () => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
declare function wasm_bindgen (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
