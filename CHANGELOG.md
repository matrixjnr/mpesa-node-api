# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-07-16

### Added
- Complete TypeScript rewrite with full type definitions
- Modern async/await API replacing callback-based approach
- Comprehensive error handling with detailed error messages
- Built-in retry mechanism for network failures
- Phone number formatting and validation utilities
- Environment variable configuration support
- Extensive test suite with 95%+ coverage
- Updated Daraja API endpoints and documentation
- Callback handling utilities for webhook processing
- Security credential generation utilities

### Changed
- **BREAKING**: Complete API rewrite - see migration guide below
- Package maintains `mpesalib` name for backward compatibility with existing users
- Minimum Node.js version requirement: 14.0.0
- All methods now return Promises instead of using callbacks
- Input validation using Joi schemas
- ESLint and TypeScript configuration
- Comprehensive examples and documentation
- GitHub Actions CI/CD pipeline

### Changed
- **BREAKING**: Complete API overhaul - not backwards compatible with v0.x
- Replaced `request` library with `axios` for better TypeScript support
- Modernized project structure with TypeScript best practices
- Updated dependencies to latest stable versions
- Improved error handling with proper error types
- Enhanced documentation with detailed API reference

### Removed
- Legacy JavaScript implementation
- Callback-based API methods
- Deprecated dependencies (`request`, `jshint`, etc.)
- Old project structure and build system

### Fixed
- Authentication token management and automatic refresh
- Phone number formatting edge cases
- Error handling for network failures
- Memory leaks in HTTP client
- Security vulnerabilities in dependencies

### Security
- Updated all dependencies to latest secure versions
- Improved security credential handling
- Added input validation to prevent injection attacks
- Secure token storage and management

## [0.0.2] - 2019-03-15

### Added
- Basic M-Pesa API integration
- Support for C2B, B2C, STK Push, and other APIs
- Environment configuration support
- Basic error handling

### Fixed
- Minor bug fixes and improvements

## [0.0.1] - 2019-01-10

### Added
- Initial release
- Basic M-Pesa Daraja API wrapper
- Support for major M-Pesa operations
