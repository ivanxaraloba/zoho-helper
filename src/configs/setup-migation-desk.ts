type configDeskMigrationType = Record<
  "origin" | "target",
  {
    orgId: string;
    departmentId: string;
    domain: "com" | "eu";
  }
>;

// The db rows should contain the same "orgId" as the "orgId" in the "configDeskMigration" object
export const configDeskMigration: configDeskMigrationType = {
  origin: {
    // Apoio ao Cliente Hyundai - Hyundai SCauto
    orgId: "687793612",
    departmentId: "384538000007025487",
    domain: "com",
  },
  target: {
    // Departamento Importador - Hyundai
    orgId: "680853844",
    departmentId: "349635000075154029",
    domain: "com",
  },
};

export const configMappingOwners: Record<"default" | string, string> &
  Record<string, string> = {
  default: "349635000000101033", // Admin - default in case the owner is not found
  // SCauto - Departamento Importador
  "384538000108627146": "349635000076844613", // Catarina Santos ( outro email / not confirmed ) -> active X
  "384538000074064007": "349635000076694132", // Diogo Magalhães Carvalho -> active X
  "384538000081006388": "349635000042246001", // Diogo Sá ( outro email ) -> active X
  "384538000017076007": "349635000024666001", // Miguel Batouxas -> active X
  "384538000084995214": "349635000076714331", // Rui Amorim -> active X
  // invativos
  // "384538000074192154": "349635000076741831", // Carla Freitas
  // "384538000081006310": "349635000076820397", // Bruna Abreu
  // "384538000081006346": "349635000076783579", // Bruna Campos
};
