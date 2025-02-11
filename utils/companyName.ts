export default function companyName(name: string) {
  return name.trim().replace(/\s/g, "-").toLowerCase();
}
