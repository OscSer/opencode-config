export class SymlinkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SymlinkError";
  }
}

export class InstallError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InstallError";
  }
}
