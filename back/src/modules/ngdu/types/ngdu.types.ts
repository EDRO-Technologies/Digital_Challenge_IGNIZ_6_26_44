export type TTarget = 'cdng' | 'kust' | 'mest' | 'ngdu' | 'obj' | 'plast' | 'well';
export type TTopology = 'geological' | 'organizational';
export type TSearchResult = Record<TTarget, { id: number; name: string; type: TTarget }[]>;
