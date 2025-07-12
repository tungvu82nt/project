# Scripts Directory

This directory contains utility scripts for maintaining code quality and performing migrations in the Yapee E-commerce project.

## Available Scripts

### 🔄 migrate-exports.js

Automatically converts named exports to default exports and updates corresponding imports across the codebase.

**Usage:**
```bash
node scripts/migrate-exports.js
```

**What it does:**
- Finds components that use named exports
- Converts them to default exports
- Updates all import statements across the codebase
- Provides detailed logging of changes made

**Components targeted:**
- UserMenu
- LanguageSelector
- LoginModal
- ProductCard
- NewsletterSection
- TestimonialsSection
- ProductViewer3D

### 📋 Code Quality Workflow

After running any migration script, follow this workflow:

1. **Type Check:**
   ```bash
   npm run type-check
   ```

2. **Lint and Fix:**
   ```bash
   npm run lint:fix
   ```

3. **Format Code:**
   ```bash
   npm run format
   ```

4. **Run Tests:**
   ```bash
   npm test
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Creating New Scripts

When creating new utility scripts:

1. **Follow naming convention:** `action-target.js` (e.g., `migrate-exports.js`, `validate-imports.js`)

2. **Include proper documentation:**
   - Purpose and description
   - Usage instructions
   - What the script modifies
   - Any prerequisites

3. **Add error handling:**
   - Check file existence
   - Validate input parameters
   - Provide meaningful error messages

4. **Make scripts idempotent:**
   - Safe to run multiple times
   - Check current state before making changes
   - Skip already processed items

5. **Provide detailed logging:**
   - What files are being processed
   - What changes are being made
   - Summary of results

## Best Practices

### Before Running Scripts
- Commit your current changes
- Create a backup branch
- Review the script to understand what it will do

### After Running Scripts
- Review all changes made
- Run the complete test suite
- Test the application manually
- Commit changes with descriptive messages

### Script Development
- Test scripts on a small subset first
- Use dry-run modes when possible
- Include rollback instructions
- Document any manual steps required

## Troubleshooting

### Common Issues

**Script fails with permission errors:**
```bash
chmod +x scripts/migrate-exports.js
```

**TypeScript compilation errors after migration:**
1. Check import/export syntax
2. Verify file paths are correct
3. Run `npm run type-check` for detailed errors

**Linting errors after migration:**
1. Run `npm run lint:fix` to auto-fix
2. Manually fix remaining issues
3. Check ESLint configuration

**Application not working after migration:**
1. Check browser console for errors
2. Verify all imports are resolved
3. Test critical user flows
4. Roll back if necessary

## Contributing

When adding new scripts:

1. Follow the established patterns
2. Add comprehensive documentation
3. Test thoroughly before committing
4. Update this README with new script information
5. Consider adding the script to package.json if it's commonly used

## Related Documentation

- [CODING_STANDARDS.md](../CODING_STANDARDS.md) - Project coding standards
- [README.md](../README.md) - Main project documentation
- [package.json](../package.json) - Available npm scripts